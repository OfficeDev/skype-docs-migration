﻿using Microsoft.Rtc.Internal.RestAPI.ResourceModel;
using Microsoft.Rtc.Internal.Platform.ResourceContract;

namespace Microsoft.SfB.PlatformService.SDK.ClientModel
{
    /// <summary>
    /// Base class for all input objects required by SDK
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public abstract class IInput<T> where T : Input
    {
        /// <summary>
        /// Converts the input object into corresponding resource in Platorm's ResourceContract
        /// </summary>
        /// <returns></returns>
        internal abstract T ToPlatformInput();
    }

    /// <summary>
    /// Provides all configuration needed to create an adoc meeting
    /// </summary>
    public class AdhocMeetingCreationInput : IInput<AdhocMeetingInput>
    {
        /// <summary>
        /// Subject of the meeting
        /// </summary>
        public string Subject { get; }

        /// <summary>
        /// Defines who all can join the meeting
        /// </summary>
        public AccessLevel AccessLevel { get; }

        /// <summary>
        /// List of users who should be the leaders for the meeting
        /// </summary>
        public string[] Leaders { get; }

        /// <summary>
        /// The policy that indicates which participants should be automatically promoted to leader when they join the online meeting
        /// <para>
        /// Leader assignments are applied when users join the online meeting. Such users are automatically promoted to the leader role
        /// </para>
        /// </summary>
        public AutomaticLeaderAssignment? AutomaticLeaderAssignment { get; }

        /// <summary>
        /// Creates an instance of <see cref="AdhocMeetingCreationInput"/>
        /// </summary>
        /// <param name="subject">Subject of the meeting</param>
        /// <param name="accessLevel"><see cref="AccessLevel"/> deciding who all can join the meeting</param>
        /// <param name="leaders">List of users who should be the leaders for the meeting</param>
        /// <param name="automaticLeaderAssignment">Policy indicating which participants should be automatically promoted to leader when they join the online meeting</param>
        public AdhocMeetingCreationInput(string subject, AccessLevel accessLevel = AccessLevel.Everyone, string[] leaders = null, AutomaticLeaderAssignment? automaticLeaderAssignment = null)
        {
            Subject = subject;
            AccessLevel = accessLevel;
            Leaders = leaders;
            AutomaticLeaderAssignment = automaticLeaderAssignment;
        }

        /// <summary>
        /// Converts the object into <see cref="AdhocMeetingInput"/> object
        /// </summary>
        /// <returns><see cref="AdhocMeetingInput"/> object containing all properties of <code>this</code> object.</returns>
        internal override AdhocMeetingInput ToPlatformInput()
        {
            return new AdhocMeetingInput()
            {
                Subject = Subject,
                AccessLevel = AccessLevel,
                Leaders = Leaders,
                AutomaticLeaderAssignment = AutomaticLeaderAssignment
            };
        }
    }
}
