import { useState, useEffect } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

export interface DeviceState {
  device: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

export function useDevice(): DeviceState {
  const calculateDeviceState = (width: number): DeviceState => {
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;

    let device: DeviceType = "desktop";
    if (isMobile) {
      device = "mobile";
    } else if (isTablet) {
      device = "tablet";
    }

    return {
      device,
      isMobile,
      isTablet,
      isDesktop,
      width,
    };
  };

  const [state, setState] = useState<DeviceState>(() => {
    if (typeof window !== "undefined") {
      return calculateDeviceState(window.innerWidth);
    }
    return {
      device: "desktop",
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      width: 1200,
    };
  });

  useEffect(() => {
    function handleResize() {
      setState(calculateDeviceState(window.innerWidth));
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return state;
}
