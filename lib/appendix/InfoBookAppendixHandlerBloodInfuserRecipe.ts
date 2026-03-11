import {
  HtmlInfoBookSerializer,
  IFileWriter,
  IFluid,
  IItem, InfoBookAppendixHandlerAbstractRecipe, IRecipe,
  ISerializeContext,
  ResourceHandler,
} from "cyclops-infobook-html";
import {compileFile as compilePug, compileTemplate} from "pug";

/**
 * Handles blood infuser recipe appendices.
 */
export class InfoBookAppendixHandlerBloodInfuserRecipe
  extends InfoBookAppendixHandlerAbstractRecipe<IRecipeBloodInfuser> {

  private readonly templateRecipe: compileTemplate;

  constructor(resourceHandler: ResourceHandler, registriesPath: string, recipeOverrides: any) {
    super('evilcraft:blood_infuser', resourceHandler, registriesPath, recipeOverrides);
    this.templateRecipe = compilePug(__dirname + '/../../template/appendix/blood_infuser_recipe.pug');
  }

  protected getRecipeNameUnlocalized(): string {
    return 'block.evilcraft.blood_infuser';
  }

  protected async serializeRecipe(recipe: IRecipeBloodInfuser, context: ISerializeContext,
                                  fileWriter: IFileWriter, serializer: HtmlInfoBookSerializer): Promise<string> {
    // Input
    const inputItem = await serializer.createItemDisplay(this.resourceHandler,
      context, fileWriter, recipe.input.item[0], true);
    const inputFluid = await serializer.createFluidDisplay(this.resourceHandler,
      context, fileWriter, recipe.input.fluid, true);

    // Outputs
    const output = await serializer.createItemDisplay(this.resourceHandler,
      context, fileWriter, recipe.output.item, true);

    const appendixIcon = await serializer.createItemDisplay(this.resourceHandler,
      context, fileWriter, { item: 'evilcraft:blood_infuser' }, false);

    let tierIcon;
    if (recipe.tier > 0) {
      tierIcon = await serializer.createItemDisplay(this.resourceHandler,
        context, fileWriter, { item: 'evilcraft:promise_tier_' + recipe.tier }, false);
    }

    // Duration
    let duration = '';
    if (recipe.duration) {
      duration = (recipe.duration / 20) + 's';
    }

    return this.templateRecipe({ inputItem, inputFluid, output, appendixIcon, tierIcon, duration });
  }

}

export interface IRecipeBloodInfuser extends IRecipe {
  input: {
    item: IItem[];
    fluid: IFluid;
  };
  output: {
    item: IItem;
  };
  tags: string[];
  duration: number;
  xp: number;
  tier: number;
}
