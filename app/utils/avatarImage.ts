import { avatarImages } from "../components/molecules/constants"

export const getAvatarImage = (avatarName: string) => {
    return avatarImages[avatarName as keyof typeof avatarImages] || avatarImages['default.png']
}


export const isValidAvatar = (avatarName: string): boolean => {
    return avatarName in avatarImages
}