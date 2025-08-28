export function usePartipantsService() {
    const toast = useToast()

    const showToast = (message: any) => {
        toast.add(message)
    }
}