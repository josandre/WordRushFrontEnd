import { StyleSheet } from 'react-native'
import { Colors } from '../../theme/color'
import base from '../../theme/style'

export default StyleSheet.create({
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    dot: {
        ...base.indicator
    },
    dotActiveWrapper: {
        marginHorizontal: 5,
        height: 16,
        width: 16,
        borderRadius: 8,
        borderColor: Colors.secondary,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authCtaContainer: {
        flex: 0.4,
        backgroundColor: Colors.bg,
        margin: 20,
        borderRadius: 15,
        padding: 15
    },
    authCtaTitle: {
        ...base.apptitle,
        color: Colors.active,
        textAlign: 'center'
    },
    authCtaHintText: {
        ...base.r16,
        color: Colors.disable
    },
    authCtaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    authCtaButton: {
        marginVertical: 20
    }
})


