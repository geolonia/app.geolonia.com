import { reducer, createActions, GeosearchActions } from "./geosearch";
import Moment from "moment";

it("should set geosearch", () => {
  const createAt = Moment();
  const updateAt = Moment();
  const action = createActions.set(
    "the-team-id",
    "the-geojson-id",
    "My Dataset",
    createAt,
    updateAt,
    false,
    {
      type: "FeatureCollection",
      features: []
    }
  );
  const nextState = reducer({}, action);
  const nextGeosearch = nextState["the-team-id"]["the-geojson-id"];
  expect(nextGeosearch.name).toEqual("My Dataset");
  expect(nextGeosearch.createAt).toEqual(createAt);
  expect(nextGeosearch.updateAt).toEqual(updateAt);
  expect(nextGeosearch.isPublic).toEqual(false);
  expect(nextGeosearch.data).toEqual({
    type: "FeatureCollection",
    features: []
  });
});

it("should update geosearch", () => {
  const action = createActions.update("the-team-id", "the-geojson-id-1", {
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: { type: "Point", coordinates: [123, 123] }
        }
      ]
    }
  });
  const nextState = reducer(
    {
      "the-team-id": {
        "the-geojson-id-2": {
          name: "Name",
          isPublic: true,
          createAt: Moment(),
          updateAt: Moment(),
          data: { type: "FeatureCollection", features: [] }
        }
      }
    },
    // @ts-ignore
    action
  );
  const nextGeosearch1 = nextState["the-team-id"]["the-geojson-id-1"];
  const nextGeosearch2 = nextState["the-team-id"]["the-geojson-id-2"];
  expect(nextGeosearch1.data.features).toHaveLength(1);
  expect(nextGeosearch2.data.features).toHaveLength(0);
});

it("should delete geosearch", () => {
  const action = createActions.delete("the-team-id", "the-geojson-id");
  const nextState = reducer(
    {
      "the-team-id": {
        "the-geojson-id": {
          name: "Name",
          isPublic: true,
          createAt: Moment(),
          updateAt: Moment(),
          data: { type: "FeatureCollection", features: [] }
        }
      }
    },
    // @ts-ignore
    action
  );
  const nextGeosearch = nextState["the-team-id"]["the-geojson-id"];
  expect(nextGeosearch).toBeUndefined();
});
