/**
 * Connection string to Azure Application Insights instance.
 * 
 * References:
 *  https://learn.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=dotnet5#is-the-connection-string-a-secret
 */
export const APPLICATION_INSIGHTS_CONNECTION_STRING = 
    "InstrumentationKey=ef2e3d1e-2ee7-4129-b4c2-75b058f43047;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/";

/**
 * Cookie names used by AI.
 */
export const APPLICATION_INSIGHTS_COOKIE_NAMES = ["ai_user", "ai_session"];
