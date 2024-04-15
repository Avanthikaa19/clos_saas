import { Theme, Layout, ExtractionQuery, Report } from "../models/Models";

export interface ReportPortalDeveloperToolsFeature {

    loadingItems: boolean;

    prevPage();

    nextPage();

    refreshItems();

    openItemDetails(item: Theme | Layout | ExtractionQuery | Report): void;

    showNotification(type: string, message: string);

}