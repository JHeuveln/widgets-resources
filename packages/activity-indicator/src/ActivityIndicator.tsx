import { flattenStyles, Style } from "@native-components/util-widgets";
import { Component, createElement } from "react";
import { ActivityIndicator as RNActivityIndicator, View, ViewStyle } from "react-native";

import { ActivityIndicatorProps } from "../typings/ActivityIndicatorProps";

interface ActivityIndicatorStyle extends Style {
    container: ViewStyle;
    indicator: {
        color: string;
    };
}

const defaultActivityStyle: ActivityIndicatorStyle = {
    indicator: {
        color: "gray"
    },
    container: {}
};

export class ActivityIndicator extends Component<ActivityIndicatorProps<ActivityIndicatorStyle>> {
    private readonly styles = flattenStyles(defaultActivityStyle, this.props.style);

    render(): JSX.Element {
        return (
            <View style={this.styles.container}>
                <RNActivityIndicator size={this.props.size} color={this.styles.indicator.color} />
            </View>
        );
    }
}
