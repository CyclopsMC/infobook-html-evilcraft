// tslint:disable:max-line-length
import {IInfobookPlugin, InfoBookInitializer, ResourceLoader} from "cyclops-infobook-html";
import {ISerializeContext} from "cyclops-infobook-html/lib/serialize/HtmlInfoBookSerializer";
import {InfoBookAppendixHandlerBloodInfuserRecipe} from "./appendix/InfoBookAppendixHandlerBloodInfuserRecipe";
import {InfoBookAppendixHandlerBroomModifier} from "./appendix/InfoBookAppendixHandlerBroomModifier";
import {InfoBookAppendixHandlerEnvirAccRecipe} from "./appendix/InfoBookAppendixHandlerEnvirAccRecipe";

/**
 * Infobook plugin for EvilCraft.
 */
export class InfobookPluginEvilCraft implements IInfobookPlugin {

  public readonly assetsPath = __dirname + '/../assets/';

  public load(infoBookInitializer: InfoBookInitializer, resourceLoader: ResourceLoader, config: any): void {
    infoBookInitializer.registerAppendixHandler('evilcraft:blood_infuser_recipe',
      new InfoBookAppendixHandlerBloodInfuserRecipe(resourceLoader.getResourceHandler(), 'registries'));
    infoBookInitializer.registerAppendixHandler('evilcraft:envir_acc_recipe',
      new InfoBookAppendixHandlerEnvirAccRecipe(resourceLoader.getResourceHandler(), 'registries'));
    infoBookInitializer.registerAppendixHandler('evilcraft:broom_modifier',
      new InfoBookAppendixHandlerBroomModifier(resourceLoader.getResourceHandler(), 'registries'));
  }

  public getHeadSuffix(context: ISerializeContext): string {
    return `<link rel="stylesheet" href="${context.baseUrl}assets/styles-evilcraft.css">`;
  }

}
