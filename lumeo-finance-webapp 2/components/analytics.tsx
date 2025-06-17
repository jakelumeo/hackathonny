import { GoogleAnalytics as GA, sendGAEvent } from "@next/third-parties/google";

/**
 * Send a Google Analytics event with the specified name and parameters.
 *
 * @param name - The name of the event to track
 * @param parameters - An object containing key-value pairs of event parameters
 * @example
 * sendGoogleAnalyticsEvent("button_click", { button_id: "submit", page: "home" });
 */
export function sendGoogleAnalyticsEvent(
    name: string,
    parameters: Record<string, string>,
) {
    sendGAEvent("event", name, parameters);
}

/**
 * Initialize Google Analytics tracking. Renders tracking script with
 * the specified tracking ID. If the tracking ID is `undefined`, the
 * component will not render anything.
 *
 * @param props the component props
 * @param props.trackingId the google analytics tracking ID
 * @returns Google Analytics Component
 */
export function GoogleAnalytics(props: { trackingId: string | undefined }) {
    return props.trackingId && <GA gaId={props.trackingId} />;
}
