import React from "react";
import {
    View,
    Text,
    Image,
    ImageSourcePropType,
} from "react-native";

import { Colors } from "@/app/theme/color";
import style from "@/app/theme/style";
import atomStyles from "./styles";

interface WelcomeTitleBarProperties {
    username: string,
    avatar?: ImageSourcePropType
}

export default function WelcomeTitleBar({ username, avatar }: WelcomeTitleBarProperties) {
    return (
        <View>
            <View style={atomStyles.welcomeTitleBar}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={[style.m12, { color: Colors.lpink, marginLeft: 5 }]}>
                            GOOD MORNING
                        </Text>
                    </View>
                    <Text style={[style.apptitle, { color: Colors.secondary, }]}>
                        {username}
                    </Text>
                </View>
                <Image
                    source={avatar}
                    resizeMode='stretch'
                    style={{ height: 56, width: 56 }} />
            </View>
        </View>
    );
}