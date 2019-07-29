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
import {join} from "path";
import {compileFile as compilePug, compileTemplate} from "pug";

/**
 * Handles blood infuser recipe appendices.
 */
export class InfoBookAppendixHandlerBloodInfuserRecipe implements IInfoBookAppendixHandler {

  private readonly resourceHandler: ResourceHandler;
  private readonly templateRecipe: compileTemplate;
  private readonly registry: IRecipeBloodInfuser[];
  private readonly registryTagged: {[tag: string]: IRecipeBloodInfuser[]};

  constructor(resourceHandler: ResourceHandler, registriesPath: string) {
    this.resourceHandler = resourceHandler;
    this.templateRecipe = compilePug(__dirname + '/../../template/appendix/blood_infuser_recipe.pug');

    const registry: IRecipeRegistryBloodInfuser = JSON.parse(
      fs.readFileSync(join(registriesPath, 'blood_infuser_recipe.json'), "utf8"));
    this.registry = [];
    this.registryTagged = {};
    for (const recipe of registry.recipes) {
      this.registry.push(recipe);
      for (const tag of recipe.tags) {
        let recipes = this.registryTagged[tag];
        if (!recipes) {
          recipes = this.registryTagged[tag] = [];
        }
        recipes.push(recipe);
      }
    }
  }

  public createAppendix(data: any): IInfoAppendix {
    let recipes: IRecipeBloodInfuser[];
    const tag = data._;
    // First try to fetch all recipes with the given tag.
    recipes = this.registryTagged['evilcraft:blood_infuser_recipe:' + tag];

    // Search by output if no such tags could be found.
    if (!recipes) {
      recipes = [];

      // Match the expected output with all recipes
      for (const recipe of this.registry) {
        // Match output item
        if (recipe.output.item === tag) {
          recipes.push(recipe);
        }
      }
    }

    if ('index' in data.$) {
      const index = data.$.index;
      if (index >= recipes.length) {
        throw new Error(`Could not find recipe ${index} for ${tag} that only has ${recipes.length} recipes.`);
      }
      recipes = [recipes[index]];
    } else if (!recipes.length) {
      throw new Error(`Could not find any recipe for ${tag}`);
    }

    return {
      getName: (context) => this.resourceHandler.getTranslation(
        'tile.blocks.evilcraft.blood_infuser.name', context.language),
      toHtml: (context: ISerializeContext, fileWriter: IFileWriter, serializer: HtmlInfoBookSerializer) => {
        return recipes.map((recipe) => this.serializeRecipe(recipe, context, fileWriter, serializer)).join('<hr />');
      },
    };
  }

  protected serializeRecipe(recipe: IRecipeBloodInfuser, context: ISerializeContext,
                            fileWriter: IFileWriter, serializer: HtmlInfoBookSerializer) {
    // Input
    const inputItem = serializer.createItemDisplay(this.resourceHandler,
      context, fileWriter, recipe.inputItem, true);
    const inputFluid = serializer.createFluidDisplay(this.resourceHandler,
      context, fileWriter, recipe.inputFluid, true);

    // Outputs
    const output = serializer.createItemDisplay(this.resourceHandler,
      context, fileWriter, recipe.output, true);

    const appendixIcon = serializer.createItemDisplay(this.resourceHandler,
      context, fileWriter, { item: 'evilcraft:blood_infuser', data: 0 }, false);

    let tierIcon;
    if (recipe.tier > 0) {
      tierIcon = serializer.createItemDisplay(this.resourceHandler,
        context, fileWriter, { item: 'evilcraft:promise', data: recipe.tier - 1 }, false);
    }

    // Duration
    let duration = '';
    if (recipe.duration) {
      duration = (recipe.duration / 20) + 's';
    }

    return this.templateRecipe({ inputItem, inputFluid, output, appendixIcon, tierIcon, duration });
  }

}

export interface IRecipeRegistryBloodInfuser {
  recipes: IRecipeBloodInfuser[];
}

export interface IRecipeBloodInfuser {
  inputItem: IItem;
  inputFluid: IFluid;
  output: IItem;
  tags: string[];
  duration: number;
  xp: number;
  tier: number;
}
