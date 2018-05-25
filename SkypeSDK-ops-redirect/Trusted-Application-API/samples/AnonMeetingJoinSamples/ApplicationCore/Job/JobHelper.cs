using Microsoft.SfB.PlatformService.SDK.Common;

namespace Microsoft.SfB.PlatformService.SDK.Samples.ApplicationCore
{
    public class PlatformServiceClientJobHelper
    {
        public static PlatformServiceJobBase GetJob(string jobId, string instanceId, AzureBasedApplicationBase azureApplication, PlatformServiceSampleJobConfiguration jobConfig)
        {
            PlatformServiceJobBase returnJob = null;
            switch (jobConfig.JobType)
            {
                case JobType.GetAnonToken:
                    {
                        if (jobConfig.AnonTokenJobInput == null)
                        {
                            Logger.Instance.Error("[PlatformServiceClientJobHelper] NULL for GetAnonTokenJob when job type is JobType.ImBridge!");
                            return null;
                        }
                        returnJob = new GetAnonTokenJob(jobId, instanceId, azureApplication, jobConfig.AnonTokenJobInput);
                        break;
                    }
             
                case JobType.AdhocMeeting:
                    {
                        if (jobConfig.GetAdhocMeetingResourceInput == null)
                        {
                            Logger.Instance.Error("[PlatformServiceClientJobHelper] NULL for GetAdhocMeetingResourceInput when job type is JobType.AdhocMeeting!");
                            return null;
                        }
                        returnJob = new GetAdhocMeetingResouceJob(jobId, instanceId, azureApplication, jobConfig.GetAdhocMeetingResourceInput);
                        break;
                    }
                default:
                    break;
            }
            return returnJob;
        }
    }
}
