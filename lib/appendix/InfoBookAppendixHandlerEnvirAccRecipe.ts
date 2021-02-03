import {
  HtmlInfoBookSerializer,
  IFileWriter,
  IFluid,
  IItem, InfoBookAppendixHandlerAbstractRecipe, IRecipe,
  ISerializeContext,
  ResourceHandler,
} from "cyclops-infobook-html";
import {createReadStream} from "fs";
import {basename, join} from "path";
import {compileFile as compilePug, compileTemplate} from "pug";

/**
 * Handles environmental accumulator recipe appendices.
 */
export class InfoBookAppendixHandlerEnvirAccRecipe extends InfoBookAppendixHandlerAbstractRecipe<IRecipeEnvirAcc> {

  private readonly templateRecipe: compileTemplate;

  constructor(resourceHandler: ResourceHandler, registriesPath: string, recipeOverrides: any) {
    super('evilcraft:environmental_accumulator', resourceHandler, registriesPath, recipeOverrides);
    this.templateRecipe = compilePug(__dirname + '/../../template/appendix/envir_acc_recipe.pug');
  }

  protected getRecipeNameUnlocalized(): string {
    return 'block.evilcraft.environmental_accumulator';
  }

  protected serializeRecipe(recipe: IRecipeEnvirAcc, context: ISerializeContext,
                            fileWriter: IFileWriter, serializer: HtmlInfoBookSerializer) {
    // Input
    const input = serializer.createItemDisplay(this.resourceHandler,
      context, fileWriter, recipe.input[0], true);
    const inputWeather = this.createWeatherDisplay(this.resourceHandler, context, serializer,
      fileWriter, recipe.inputWeather);
    const inputFluid = serializer.createFluidDisplay(this.resourceHandler, context,
      fileWriter, recipe.fluid, true);

    // Outputs
    const output = serializer.createItemDisplay(this.resourceHandler,
      context, fileWriter, recipe.output, true);
    const outputWeather = this.createWeatherDisplay(this.resourceHandler, context, serializer,
      fileWriter, recipe.outputWeather);

    const iconRegular = serializer.createItemDisplay(this.resourceHandler,
      context, fileWriter, { item: 'evilcraft:environmental_accumulator' }, false);
    const iconSanguinary = serializer.createItemDisplay(this.resourceHandler,
      context, fileWriter, { item: 'evilcraft:sanguinary_environmental_accumulator' }, false);

    // Duration
    let duration = '';
    if (recipe.duration) {
      duration = (recipe.duration / 20) + 's';
    }

    return this.templateRecipe({ input, inputWeather, output, outputWeather, appendixIcon: iconRegular, duration })
      + this.templateRecipe({ input, inputFluid, inputWeather, output, outputWeather, appendixIcon: iconSanguinary });
  }

  protected createWeatherDisplay(resourceHandler: ResourceHandler, context: ISerializeContext,
                                 serializer: HtmlInfoBookSerializer, fileWriter: IFileWriter,
                                 weather: Weather): string {
    if (weather === 'any') {
      return '<div class="item item-slot">&nbsp;</div>';
    }

    const icon = join(__dirname, '../../icons_weather/', weather + '.png');
    const iconUrl = fileWriter.write('icons/' + basename(icon), createReadStream(icon));

    return serializer.templateItem({
      ...context,
      count: 1,
      icon: iconUrl,
      name: resourceHandler.getTranslation('weather_container.evilcraft.' + weather, context.language),
      slot: true,
    });
  }

}

export interface IRecipeEnvirAcc extends IRecipe {
  input: IItem[];
  output: IItem;
  inputWeather: Weather;
  outputWeather: Weather;
  tags: string[];
  duration: number;
  fluid: IFluid;
}

export type Weather = 'any' | 'clear' | 'rain' | 'lightning';
