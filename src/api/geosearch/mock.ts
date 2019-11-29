import { FeatureCollection, DateStringify } from "../../types";
import uuid from "uuid/v4";

export const generate = (): DateStringify<FeatureCollection>[] => {
  const featuresCount = Math.floor(Math.random() * 5) + 3;
  const featureCount = Math.floor(Math.random() * 10) + 3;

  return Array(featuresCount)
    .fill(0)
    .map(() => {
      return {
        id: uuid(),
        createAt: Date(),
        updateAt: Date(),
        isPublic: Math.random() > 0.5,
        data: {
          type: "FeatureCollection",
          features: Array(featureCount)
            .fill(0)
            .map(() => {
              return {
                id: uuid(),
                type: "Feature",
                properties: {},
                geometry: {
                  coordinates: [137 + Math.random(), 34 + Math.random()],
                  type: "Point"
                }
              };
            })
        }
      };
    });
};

export default generate;
