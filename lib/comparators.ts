export const sortById = (a, b): number => Number(a.id) - Number(b.id)
export const sortByINN = (a, b): number => Number(a.inn) - Number(b.inn)
export const sortByName = (a, b) => a.name.localeCompare(b.name)
export const sortByStatus = (a, b) => {
    if(a.accepted === null && b.accepted === null) return 0
    if(a.accepted === null && b.accepted !== null) return -1
    if(a.accepted !== null && b.accepted === null) return 1
}
export const sortByDate = ({date: dateA}, {date: dateB}) => {
    if(new Date(dateA) < new Date(dateB)) return 1
    if(new Date(dateA) > new Date(dateB)) return -1
    if(new Date(dateA) == new Date(dateB)) return 0
}