import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// import { useRouter, usePathname } from "next/navigation";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// export const isLocationMatch = (targetLocation, locationName) => {
//   const cleanTarget = targetLocation.replace(/^\/\w{2}\//, "/");
//   const cleanLocation = locationName.replace(/^\/\w{2}\//, "/");

//   return cleanLocation === cleanTarget;
// };
export const isLocationMatch = (pathname) => {
  const adminsPaths = [
    "/dashboard/admins",
    "/dashboard/create-admin",
    "/dashboard/admin/:id/view",
  ];
  const branchPaths = [
    "/dashboard/branches",
    "/dashboard/create-branch",
    "/dashboard/branch/:id/view",
  ];

  const restaurantPaths = [
    "/dashboard/restaurants",
    "/dashboard/create-restaurant",
    "/dashboard/restaurant/:id/view",
  ];

  const sectionPaths = [
    "/dashboard/sections",
    "/dashboard/create-section",
    "/dashboard/section/:id/view",
    "/dashboard/sections/:id",
  ];

  const itemsPaths = [
    "/dashboard/items",
    "/dashboard/create-item",
    "/dashboard/item/:id/view",
  ];
  const createOrderPaths = [
    "/dashboard/create-order",
  ];
  const ordersPaths = [
    "/dashboard/orders",
  ];

  const cleanedPathname = pathname.replace(/^\/[a-z]{2}\//, "/");
  // console.log("cleanedPathname:", cleanedPathname);

  const matchExactPath = (paths, pathname) => {
    return paths.some((path) => {
      if (path.includes(":id")) {
        const regex = new RegExp("^" + path.replace(":id", "\\d+") + "$");
        return regex.test(pathname);
      }
      return path === pathname;
    });
  };

  if (matchExactPath(adminsPaths, cleanedPathname)) {
    return "admins";
  }

  if (matchExactPath(branchPaths, cleanedPathname)) {
    return "branches";
  }
  if (matchExactPath(restaurantPaths, cleanedPathname)) {
    return "restaurants";
  }
  if (matchExactPath(sectionPaths, cleanedPathname)) {
    return "sections";
  }
  if (matchExactPath(itemsPaths, cleanedPathname)) {
    return "items";
  }
  if (matchExactPath(createOrderPaths, cleanedPathname)) {
    return "createOrder";
  }
  if (matchExactPath(ordersPaths, cleanedPathname)) {
    return "orders";
  }

  return null;
};

export const RGBToHex = (r, g, b) => {
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const redHex = componentToHex(r);
  const greenHex = componentToHex(g);
  const blueHex = componentToHex(b);

  return "#" + redHex + greenHex + blueHex;
};

export function hslToHex(hsl) {
  // Remove "hsla(" and ")" from the HSL string
  hsl = hsl.replace("hsla(", "").replace(")", "");

  // Split the HSL string into an array of H, S, and L values
  const [h, s, l] = hsl.split(" ").map((value) => {
    if (value.endsWith("%")) {
      // Remove the "%" sign and parse as a float
      return parseFloat(value.slice(0, -1));
    } else {
      // Parse as an integer
      return parseInt(value);
    }
  });

  // Function to convert HSL to RGB
  function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    // Convert RGB values to integers
    const rInt = Math.round(r * 255);
    const gInt = Math.round(g * 255);
    const bInt = Math.round(b * 255);

    // Convert RGB values to a hex color code
    const rgbToHex = (value) => {
      const hex = value.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${rgbToHex(rInt)}${rgbToHex(gInt)}${rgbToHex(bInt)}`;
  }

  // Call the hslToRgb function and return the hex color code
  return hslToRgb(h, s, l);
}

export const hexToRGB = (hex, alpha) => {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
};

// export const formatTime = (time) => {
//   if (!time) return "";

//   const date = new Date(time);
//   const formattedTime = date.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true, // Add this option to display AM/PM
//   });

//   return formattedTime;
// };

// object check
// export function isObjectNotEmpty(obj) {
//   if (typeof obj !== "object" || obj === null) {
//     return false;
//   }
//   return Object.keys(obj).length > 0;
// }

// export const formatDate = (date) => {
//   const options = { year: "numeric", month: "long", day: "numeric" };
//   return new Date(date).toLocaleDateString("en-US", options);
// };

// // random word
// export function getWords(inputString) {
//   // Remove spaces from the input string
//   const stringWithoutSpaces = inputString.replace(/\s/g, "");

//   // Extract the first three characters
//   return stringWithoutSpaces.substring(0, 3);
// }

// for path name

export function getDynamicPath(pathname) {
  const prefixes = ["en", "bn", "ar"];
  for (const prefix of prefixes) {
    if (pathname.startsWith(`/${prefix}/`)) {
      return `/${pathname.slice(prefix.length + 2)}`;
    }
  }
  return pathname;
}

// translate

export const translate = (title, trans) => {
  const lowercaseTitle = title.toLowerCase();

  if (trans?.hasOwnProperty(lowercaseTitle)) {
    return trans[lowercaseTitle];
  }

  return title;
};

export const selectStyles = (theme,color) => ({
  multiValue: (base, state) => {
    const backgroundColor = "hsl(var(--primary) / var(--tw-bg-opacity))";
    const color = "#000";
    const borderRadius = "0px";
    const fontSize = "0.75rem";
    const lineHeight = "1rem";

    return state.data.isFixed
      ? {
          ...base,
          opacity: "0.5",
          backgroundColor: backgroundColor,
          borderRadius: borderRadius,
          fontSize: fontSize,
          lineHeight: lineHeight,
          color: color,
        }
      : {
          ...base,
          backgroundColor: backgroundColor,
          borderRadius: borderRadius,
          fontSize: fontSize,
          lineHeight: lineHeight,
          color: color,
        };
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? {
          ...base,
          color: theme === "dark" ? "#ccc" : "#626262",
          paddingRight: 6,
        }
      : {
          ...base,
          color: theme === "dark" ? "#ccc" : "#626262",
        };
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    backgroundColor: state.isSelected
      ? theme === "dark"
        ? "hsl(var(--background) / var(--tw-bg-opacity, 1)) !important"
        : "hsl(var(--background) / var(--tw-bg-opacity, 1)) !important"
      : state.isFocused
      ? theme === "dark"
        ? "hsl(var(--background) / var(--tw-bg-opacity, 1)) !important"
        : "hsl(var(--background) / var(--tw-bg-opacity, 1)) !important"
      : "transparent",
    color:
      theme === "dark"
        ? "hsl(var(--text-default-500) / var(--tw-text-opacity, 1))"
        : "hsl(var(--text-default-500) / var(--tw-text-opacity, 1))",
    cursor: "pointer",
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled
      ? "hsl(var(--default-200) / var(--tw-bg-opacity, 1)) !important"
      : theme === "dark"
      ? "hsl(var(--background) / var(--tw-bg-opacity, 1)) !important"
      : "hsl(var(--background) / var(--tw-bg-opacity, 1)) !important",
    borderColor: state.isDisabled
      ? "#dcdcdc"
      : theme === "dark"
      ? "hsl(var(--default-300) / var(--tw-border-opacity, 1)) !important"
      : "#ccc",
    color:
      theme === "dark"
        ? "hsl(var(--text-default-500) / var(--tw-text-opacity, 1))"
        : "hsl(var(--text-default-500) / var(--tw-text-opacity, 1))",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    borderColor: state.isFocused ? "none" : "none",
    boxShadow: state.isFocused ? "" : "none",
  }),

  singleValue: (provided, state) => ({
    ...provided,
    color: color,
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor:
      "hsl(var(--background) / var(--tw-bg-opacity, 1)) !important",
  }),
});

// export default selectStyles;
