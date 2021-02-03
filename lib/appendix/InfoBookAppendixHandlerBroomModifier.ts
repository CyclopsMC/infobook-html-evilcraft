import {
  HtmlInfoBookSerializer,
  IFileWriter,
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
 * Handles broom modifier appendices.
 */
export class InfoBookAppendixHandlerBroomModifier implements IInfoBookAppendixHandler {

  private readonly resourceHandler: ResourceHandler;
  private readonly templateRecipe: compileTemplate;
  private readonly registry: IRegistryBroomModifier;

  constructor(resourceHandler: ResourceHandler, registriesPath: string) {
    this.resourceHandler = resourceHandler;
    this.templateRecipe = compilePug(__dirname + '/../../template/appendix/broom_modifier.pug');

    this.registry = JSON.parse(
      fs.readFileSync(join(registriesPath, 'broom_modifier.json'), "utf8"));
  }

  public createAppendix(data: any): IInfoAppendix {
    const modifierName = data._;

    // Select modifier
    const modifier = this.registry[modifierName];
    if (!modifier) {
      throw new Error(`Could not find a modifier for ${modifierName}`);
    }

    return {
      getName: (context) => this.resourceHandler.getTranslation(
        'broom.modifiers.evilcraft.type', context.language),
      skipWrapper: modifier.items.length === 0,
      toHtml: (context: ISerializeContext, fileWriter: IFileWriter, serializer: HtmlInfoBookSerializer) => {
        if (modifier.items.length === 0) {
          return '';
        }
        return this.serializeModifier(modifier, context, fileWriter, serializer);
      },
    };
  }

  protected serializeModifier(modifier: IBroomModifier, context: ISerializeContext,
                              fileWriter: IFileWriter, serializer: HtmlInfoBookSerializer) {
    const name = this.resourceHandler.getTranslation(modifier.name, context.language);
    const entries = modifier.items.map((i) => ({
      item: serializer.createItemDisplay(this.resourceHandler,
        context, fileWriter, i.item, true),
      modifier: i.modifier,
    }));

    return this.templateRecipe({ name, entries });
  }

}

export interface IRegistryBroomModifier {
  [id: string]: IBroomModifier;
}

export interface IBroomModifier {
  items: { item: IItem, modifier: number }[];
  name: string;
}
