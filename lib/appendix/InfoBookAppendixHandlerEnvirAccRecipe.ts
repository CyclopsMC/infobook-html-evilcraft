import {
  HtmlInfoBookSerializer,
  IFileWriter,
  IFluid,
  IInfoAppendix,
  IInfoBookAppendixHandler,
  IItem,
  ISerializeContext,
  ResourceHandler,
} from "cyclops-infobook-html";
import * as fs from "fs";
import {createReadStream} from "fs";
import {basename, join} from "path";
import {compileFile as compilePug, compileTemplate} from "pug";

/**
 * Handles environmental accumulator recipe appendices.
 */
export class InfoBookAppendixHandlerEnvirAccRecipe implements IInfoBookAppendixHandler {

  private readonly resourceHandler: ResourceHandler;
  private readonly templateRecipe: compileTemplate;
  private readonly registry: IRecipeEnvirAcc[];

  constructor(resourceHandler: ResourceHandler, registriesPath: string) {
    this.resourceHandler = resourceHandler;
    this.templateRecipe = compilePug(__dirname + '/../../template/appendix/envir_acc_recipe.pug');

    const registry: IRecipeRegistryEnvirAcc = JSON.parse(
      fs.readFileSync(join(registriesPath, 'evir_acc_recipe.json'), "utf8"));
    this.registry = registry.recipes;
  }

  public createAppendix(data: any): IInfoAppendix {
    const recipes: IRecipeEnvirAcc[] = [];
    const index = data.$.index || 0;
    const item = data._;

    // Match the expected output with all recipes
    for (const r of this.registry) {
      // Match output item
      if (r.output.item === item) {
        recipes.push(r);
      }
    }

    // Select recipe
    if (!recipes.length) {
      throw new Error(`Could not find any recipe for ${item}`);
    }
    if (index >= recipes.length) {
      throw new Error(`Could not find recipe ${index} for ${item} that only has ${recipes.length} recipes.`);
    }
    const recipe = recipes[index];

    return {
      getName: (context) => this.resourceHandler.getTranslation(
        'tile.blocks.evilcraft.environmental_accumulator.name', context.language),
      toHtml: (context: ISerializeContext, fileWriter: IFileWriter, serializer: HtmlInfoBookSerializer) => {
        return this.serializeRecipe(recipe, context, fileWriter, serializer);
      },
    };
  }

  protected serializeRecipe(recipe: IRecipeEnvirAcc, context: ISerializeContext,
                            fileWriter: IFileWriter, serializer: HtmlInfoBookSerializer) {
    // Input
    const input = serializer.createItemDisplay(this.resourceHandler,
      context, fileWriter, recipe.input, true);
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
      context, fileWriter, { item: 'evilcraft:environmental_accumulator', data: 0 }, false);
    const iconSanguinary = serializer.createItemDisplay(this.resourceHandler,
      context, fileWriter, { item: 'evilcraft:sanguinary_environmental_accumulator', data: 0 }, false);

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

export interface IRecipeRegistryEnvirAcc {
  recipes: IRecipeEnvirAcc[];
}

export interface IRecipeEnvirAcc {
  input: IItem;
  output: IItem;
  inputWeather: Weather;
  outputWeather: Weather;
  tags: string[];
  duration: number;
  fluid: IFluid;
}

export type Weather = 'any' | 'clear' | 'rain' | 'lightning';
