/** Local image assets — bundled in /public/images for reliable loading */
const ASSET_VERSION = "20250628";
const local = (path: string) => `/images/${path}?v=${ASSET_VERSION}`;

export const images = {
  logo: "/brand/app-logo.png",

  cafes: {
    "cafe-1": local("cafes/cafe-1.jpg"),
    "cafe-2": local("cafes/cafe-2.jpg"),
    "cafe-3": local("cafes/cafe-3.jpg"),
    "cafe-4": local("cafes/cafe-4.jpg"),
    "cafe-5": local("cafes/cafe-5.jpg"),
    "cafe-6": local("cafes/cafe-6.jpg"),
    "cafe-7": local("cafes/cafe-7.jpg"),
    "cafe-8": local("cafes/cafe-8.jpg"),
  },

  menu: {
    "m-1": local("menu/m-1.jpg"),
    "m-2": local("menu/m-2.jpg"),
    "m-3": local("menu/m-3.jpg"),
    "m-4": local("menu/m-4.jpg"),
    "m-5": local("menu/m-5.jpg"),
    "m-6": local("menu/m-6.jpg"),
    "m-7": local("menu/m-7.jpg"),
    "m-8": local("menu/m-8.jpg"),
    "m-9": local("menu/m-9.jpg"),
    "m-10": local("menu/m-10.jpg"),
    "m-11": local("menu/m-11.jpg"),
    "m-12": local("menu/m-12.jpg"),
    "m-13": local("menu/m-13.jpg"),
    "m-14": local("menu/m-14.jpg"),
    "m-15": local("menu/m-15.jpg"),
    "m-16": local("menu/m-16.jpg"),
    "m-17": local("menu/m-17.jpg"),
    "m-18": local("menu/m-18.jpg"),
    "m-19": local("menu/m-19.jpg"),
    "m-20": local("menu/m-20.jpg"),
    "m-21": local("menu/m-21.jpg"),
    "m-22": local("menu/m-22.jpg"),
    "m-23": local("menu/m-23.jpg"),
    "m-24": local("menu/m-24.jpg"),
    "m-25": local("menu/m-25.jpg"),
    "m-26": local("menu/m-26.jpg"),
    "m-27": local("menu/m-27.jpg"),
    "m-28": local("menu/m-28.jpg"),
    "m-29": local("menu/m-29.jpg"),
    "m-30": local("menu/m-30.jpg"),
    "m-31": local("menu/m-31.jpg"),
    "m-32": local("menu/m-32.jpg"),
    "m-33": local("menu/m-33.jpg"),
    "m-34": local("menu/m-34.jpg"),
    "m-35": local("menu/m-35.jpg"),
    "m-36": local("menu/m-36.jpg"),
    "m-37": local("menu/m-37.jpg"),
    "m-38": local("menu/m-38.jpg"),
    "m-39": local("menu/m-39.jpg"),
    "m-40": local("menu/m-40.jpg"),
    "m-41": local("menu/m-41.jpg"),
    "m-42": local("menu/m-42.jpg"),
  },

  rewards: {
    "r-1": local("rewards/r-1.jpg"),
    "r-2": local("rewards/r-2.jpg"),
    "r-3": local("rewards/r-3.jpg"),
    "r-4": local("rewards/r-4.jpg"),
    "r-5": local("rewards/r-5.jpg"),
    "r-6": local("rewards/r-6.jpg"),
  },

  promos: {
    "p-1": local("promos/p-1.jpg"),
    "p-2": local("promos/p-2.jpg"),
  },

  merchants: {
    "m-1": local("cafes/cafe-1.jpg"),
    "m-2": local("cafes/cafe-6.jpg"),
    "m-3": local("cafes/cafe-7.jpg"),
  },
} as const;
