import { ref } from 'vue'

export const useLoading =() => {
    const showLoading = ref(false)

    const defaultLoadingTime = 1000
    const handleLoading = (show: boolean = true) => {
        showLoading.value = show
        setTimeout(() => {
            showLoading.value = false
        }, defaultLoadingTime)
    }

    return {
        showLoading,
        handleLoading
    }
}