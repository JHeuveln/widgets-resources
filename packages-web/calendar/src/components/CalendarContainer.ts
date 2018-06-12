import { Component, createElement } from "react";

import { Calendar, CalendarEvent } from "./Calendar";

interface WrapperProps {
    mxObject: mendix.lib.MxObject;
    mxform: mxui.lib.form._FormBase;
}

interface CalendarContainerProps extends WrapperProps {
    titleAttribute: string;
    startAttribute: string;
    endAttribute: string;
    defaultView: string;
    dataSource: DataSource;
    eventEntity: string;
    entityConstraint: string;
    dataSourceMicroflow: string;
    popup: boolean;
    onClickEvent: OnClickEventOptions;
    onClickSlotEvent: OnClickEventOptions;
    eventPage: string;
    openPageAs: PageLocation;
    eventMicroflow: string;
    eventNanoflow: Nanoflow;
    slotPage: string;
    slotMicroflow: string;
    slotNanoflow: Nanoflow;
}

type DataSource = "XPath" | "microflow";
type OnClickEventOptions = "doNothing" | "showPage" | "callMicroflow" | "callNanoflow";
type PageLocation = "content" | "popup" | "modal";

interface CalendarContainerState {
    alertMessage?: string;
    events: CalendarEvent[];
}

interface Nanoflow {
    nanoflow: object[];
    paramsSpec: { Progress: string };
}

export default class CalendarContainer extends Component<CalendarContainerProps, CalendarContainerState> {
    private subscriptionHandles: number[];

    constructor(props: CalendarContainerProps) {
        super(props);

        this.subscriptionHandles = [];
        this.state = { events: [] };
    }

    render() {
        return createElement(Calendar, {
            events: this.state.events,
            defaultView: this.props.defaultView,
            popup: this.props.popup,
            onSelectEventAction: this.excecuteEventAction,
            onSelectSlotAction: this.excecuteSlotAction
        });
    }

    componentWillUnMount() {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
    }

    componentWillReceiveProps(nextProps: CalendarContainerProps) {
        this.fetchData(nextProps.mxObject);
        this.resetSubscriptions(nextProps.mxObject);
    }

    private fetchData = (mxObject?: mendix.lib.MxObject) => {
        const { dataSource, dataSourceMicroflow, eventEntity } = this.props;
        if (dataSource === "XPath" && eventEntity && mxObject) {
            this.fetchEventsByXPath(mxObject.getGuid());
        } else if (dataSource === "microflow" && dataSourceMicroflow) {
            this.fetchEventsByMicroflow(mxObject);
        }
    }

    private resetSubscriptions = (mxObject?: mendix.lib.MxObject) => {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
        this.subscriptionHandles = [];

        if (mxObject) {
            this.subscriptionHandles.push(window.mx.data.subscribe({
                callback: () => this.fetchData(mxObject),
                entity: this.props.eventEntity
            }));
            this.subscriptionHandles.push(window.mx.data.subscribe({
                callback: () => this.fetchData(mxObject),
                guid: mxObject.getGuid()
            }));
            [
                this.props.titleAttribute,
                this.props.startAttribute,
                this.props.endAttribute
            ].forEach(attr => this.subscriptionHandles.push(window.mx.data.subscribe({
                attr,
                callback: () => this.fetchData(mxObject), guid: mxObject.getGuid()
            })));
        }
    }

    private fetchEventsByXPath(contextGuid: string) {
        const { entityConstraint, eventEntity } = this.props;
        const constraint = entityConstraint ? entityConstraint.replace(/\[%CurrentObject%\]/g, contextGuid) : "";
        const XPath = `//${eventEntity}${constraint}`;

        window.mx.data.get({
            xpath: XPath,
            callback: mxObjects => this.setEventsFromMxObjects(mxObjects)
        });
    }

    private setEventsFromMxObjects = (mxObjects: mendix.lib.MxObject[]) => {
        const { titleAttribute, startAttribute, endAttribute } = this.props;
        const events = mxObjects.map(mxObject => {
            const title = mxObject.get(titleAttribute) as string;
            const start = new Date(mxObject.get(startAttribute) as number);
            const end = new Date(mxObject.get(endAttribute) as number);
            const guid = mxObject.getGuid();

            return {
                title,
                start,
                end,
                guid
            };
        });
        this.setState({ events });
    }

    private fetchEventsByMicroflow(mxObject?: mendix.lib.MxObject) {
        const { dataSourceMicroflow } = this.props;
        if (mxObject && dataSourceMicroflow) {
            window.mx.ui.action(dataSourceMicroflow, {
                callback: (mxObjects: mendix.lib.MxObject[]) => this.setEventsFromMxObjects(mxObjects),
                error: error => window.mx.ui.error(`Error while executing microflow: ${dataSourceMicroflow}: ${error.message}`),
                params: {
                    applyto: "selection",
                    guids: mxObject ? [ mxObject.getGuid() ] : []
                }
            });
        }
    }

    private excecuteEventAction = () => {
        const { mxObject, onClickEvent, eventMicroflow, mxform, eventNanoflow, openPageAs, eventPage } = this.props;
        if (!mxObject || !mxObject.getGuid()) {
            return;
        }
        const context = new mendix.lib.MxContext();
        context.setContext(mxObject.getEntity(), mxObject.getGuid());
        if (onClickEvent === "callMicroflow" && eventMicroflow && mxObject.getGuid()) {
            window.mx.ui.action(eventMicroflow, {
                error: error => window.mx.ui.error(`Error while executing microflow: ${eventMicroflow}: ${error.message}`),
                origin: mxform,
                context
            });
        } else if (onClickEvent === "callNanoflow" && eventNanoflow.nanoflow) {
            window.mx.data.callNanoflow({
                context,
                error: error => window.mx.ui.error(
                    `An error occurred while executing the nanoflow: ${error.message}`
                ),
                nanoflow: eventNanoflow,
                origin: mxform
            });
        } else if (onClickEvent === "showPage" && eventPage && mxObject.getGuid()) {
            window.mx.ui.openForm(eventPage, {
                context,
                error: error => window.mx.ui.error(
                    `Error while opening page ${eventPage}: ${error.message}`
                ),
                location: openPageAs
            });
        }
    }

    private excecuteSlotAction = () => {
        const { mxObject, onClickSlotEvent, slotMicroflow, mxform, slotNanoflow, openPageAs, slotPage } = this.props;
        if (!mxObject || !mxObject.getGuid()) {
            return;
        }
        const context = new mendix.lib.MxContext();
        context.setContext(mxObject.getEntity(), mxObject.getGuid());
        if (onClickSlotEvent === "callMicroflow" && slotMicroflow && mxObject.getGuid()) {
            window.mx.ui.action(slotMicroflow, {
                error: error => window.mx.ui.error(`Error while executing microflow: ${slotMicroflow}: ${error.message}`),
                origin: mxform,
                context
            });
        } else if (onClickSlotEvent === "callNanoflow" && slotNanoflow.nanoflow) {
            window.mx.data.callNanoflow({
                context,
                error: error => window.mx.ui.error(
                    `An error occurred while executing the nanoflow: ${error.message}`
                ),
                nanoflow: slotNanoflow,
                origin: mxform
            });
        } else if (onClickSlotEvent === "showPage" && slotPage && mxObject.getGuid()) {
            window.mx.ui.openForm(slotPage, {
                context,
                error: error => window.mx.ui.error(
                    `Error while opening page ${slotPage}: ${error.message}`
                ),
                location: openPageAs
            });
        }
    }
}