export const formatTimeStamp = (date) => {
    const d = new Date(date)
    d.setHours(d.getHours() + 5)

    return d
}