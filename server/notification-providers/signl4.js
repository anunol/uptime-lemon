const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const { UP, DOWN } = require("../../src/util");

class SIGNL4 extends NotificationProvider {
    name = "SIGNL4";

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";

        try {
            let data = {
                heartbeat: heartbeatJSON,
                monitor: monitorJSON,
                msg,
                // Source system
                "X-S4-SourceSystem": "UptimeKuma",
                monitorUrl: this.extractAdress(monitorJSON),
            };

            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            if (heartbeatJSON == null) {
                // Test alert
                data.title = "Uptime Lemon Alert";
                data.message = msg;
            } else if (heartbeatJSON.status === UP) {
                data.title = "Uptime Lemon Monitor ✅ Up";
                data["X-S4-ExternalID"] = "UptimeKuma-" + monitorJSON.monitorID;
                data["X-S4-Status"] = "resolved";
            } else if (heartbeatJSON.status === DOWN) {
                data.title = "Uptime Lemon Monitor 🔴 Down";
                data["X-S4-ExternalID"] = "UptimeKuma-" + monitorJSON.monitorID;
                data["X-S4-Status"] = "new";
            }

            await axios.post(notification.webhookURL, data, config);
            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }
}

module.exports = SIGNL4;
