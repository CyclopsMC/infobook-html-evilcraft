// tslint:disable:max-line-length
import {IInfobookPlugin, InfoBookInitializer, ResourceLoader} from "cyclops-infobook-html";
import {ISerializeContext} from "cyclops-infobook-html/lib/serialize/HtmlInfoBookSerializer";

/**
 * Infobook plugin for EvilCraft.
 */
export class InfobookPluginEvilCraft implements IInfobookPlugin {

  public readonly assetsPath = __dirname + '/../assets/';

  public load(infoBookInitializer: InfoBookInitializer, resourceLoader: ResourceLoader, config: any): void {
    // TODO
  }

  public getHeadSuffix(context: ISerializeContext): string {
    return `<link rel="stylesheet" href="${context.baseUrl}assets/styles-evilcraft.css">`;
  }

}
