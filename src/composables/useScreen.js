import { useScreenOrientation } from "@vueuse/core";
import { computed } from "vue";

export const useScreen = () => {
  const { orientation } = useScreenOrientation();
  const isLandscape = computed(() => /landscape/.test(orientation.value));
  const isPortrait = computed(() => /portrait/.test(orientation.value));

  return {
    isLandscape,
    isPortrait,
    orientation
  };
};
