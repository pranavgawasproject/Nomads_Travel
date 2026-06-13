import React, { useEffect, useMemo, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const ReviewFetch = () => {
  // --- UI/debug state ---
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);
  const [place, setPlace] = useState(null);
  const [resolvedPlaceId, setResolvedPlaceId] = useState(null);

  // 0) Put your key in .env: VITE_GOOGLE_MAPS_API_KEY=xxxxx
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // 1) After you learn the exact placeId once, paste it here and skip searching forever
  const HARDCODED_PLACE_ID = ""; // e.g. "ChIJxxxxxxxxxxxxxxxx"

  // 2) Panaji/Patto geographical hints (bias + restriction)
  //    If you change these, keep a small rectangle around Patto Centre / Dempo Trade Centre.
  const PANaji_CENTER = { lat: 15.4968, lng: 73.8278 }; // city center
  const PATTO_RECT = {
    north: 15.505, // ~a few blocks north
    south: 15.49, // ~a few blocks south
    east: 73.84, // ~a few blocks east
    west: 73.82, // ~a few blocks west
  };

  // 3) Robust query variants (name, address, phone)
  const queries = useMemo(
    () => [
      // exact-ish address line as used publicly
      "MeWo - Meetings & Co-Working, Dempo Trade Center, Patto, Panaji, Goa 403001",
      // brand + building
      "MeWo Meetings & Co-Working Dempo Trade Center Panaji Goa",
      "BIZ Nest coworking Dempo Trade Center Patto Panaji",
      // shorter fallbacks
      "MeWo Goa",
      "BIZ Nest Panaji",
      // phone numbers (no spaces, region 'in' is important for phone lookups)
      "+918007126444",
      "+918104564129",
    ],
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // STEP 1: Validate API key
        setStep(1);
        console.log("[STEP 1] Validate API key");
        if (!API_KEY) {
          throw new Error("VITE_GOOGLE_MAPS_API_KEY missing in .env");
        }

        // STEP 2: Init loader
        setStep(2);
        console.log("[STEP 2] Create Google Maps JS loader");
        const loader = new Loader({
          apiKey: API_KEY,
          version: "weekly",
          libraries: ["places"],
        });

        // STEP 3: Load Maps JS
        setStep(3);
        console.log("[STEP 3] Load Maps JS");
        const google = await loader.load();
        if (cancelled) return;
        console.log("... google.maps loaded:", !!google?.maps);

        // STEP 4: Import Places lib
        setStep(4);
        console.log('[STEP 4] importLibrary("places")');
        const { Place } = await google.maps.importLibrary("places");
        console.log("... Place class available:", typeof Place === "function");

        // STEP 5: Determine placeId (either hardcoded or via robust search)
        let placeId = HARDCODED_PLACE_ID;
        if (placeId) {
          console.log("[STEP 5] Using HARDCODED_PLACE_ID:", placeId);
        } else {
          console.log(
            "[STEP 5] Resolve placeId via Text Search (multiple attempts)"
          );

          // Helper: perform one search attempt and log results
          async function searchAttempt(request, label) {
            console.log(`... Attempt (${label})`, request);
            try {
              const { places } = await Place.searchByText(request);
              const list = places || [];
              console.log(`... Results (${label}):`, list.length);
              list.forEach((p, i) => {
                console.log(
                  `   #${i}`,
                  "| name:",
                  p.displayName,
                  "| addr:",
                  p.formattedAddress,
                  "| id:",
                  p.id,
                  "| types:",
                  (p.types || []).join(",")
                );
              });
              return list;
            } catch (err) {
              console.warn(
                `... Attempt (${label}) failed:`,
                err?.message || err
              );
              return [];
            }
          }

          // Try each query with: (A) Patto rectangle restriction, (B) Panaji center bias, (C) no bias
          for (const q of queries) {
            // A) locationRestriction (tight box around Patto)
            const listA = await searchAttempt(
              {
                textQuery: q,
                fields: [
                  "id",
                  "displayName",
                  "formattedAddress",
                  "location",
                  "types",
                ],
                locationRestriction: PATTO_RECT,
                region: "in",
                maxResultCount: 8,
              },
              `A: restriction + "${q}"`
            );
            // pick a likely match
            let picked =
              listA.find((p) => /mewo|biz\s*nest/i.test(p.displayName ?? "")) ||
              listA.find((p) =>
                /dempo\s*trade\s*center|patto/i.test(p.formattedAddress ?? "")
              ) ||
              listA[0];

            if (!picked) {
              // B) city bias
              const listB = await searchAttempt(
                {
                  textQuery: q,
                  fields: [
                    "id",
                    "displayName",
                    "formattedAddress",
                    "location",
                    "types",
                  ],
                  locationBias: PANaji_CENTER,
                  region: "in",
                  maxResultCount: 8,
                },
                `B: bias + "${q}"`
              );
              picked =
                listB.find((p) =>
                  /mewo|biz\s*nest/i.test(p.displayName ?? "")
                ) ||
                listB.find((p) =>
                  /dempo\s*trade\s*center|patto/i.test(p.formattedAddress ?? "")
                ) ||
                listB[0];

              if (!picked) {
                // C) no bias
                const listC = await searchAttempt(
                  {
                    textQuery: q,
                    fields: [
                      "id",
                      "displayName",
                      "formattedAddress",
                      "location",
                      "types",
                    ],
                    region: "in", // esp. useful for phone number queries
                    maxResultCount: 8,
                  },
                  `C: no-bias + "${q}"`
                );
                picked =
                  listC.find((p) =>
                    /mewo|biz\s*nest/i.test(p.displayName ?? "")
                  ) ||
                  listC.find((p) =>
                    /dempo\s*trade\s*center|patto/i.test(
                      p.formattedAddress ?? ""
                    )
                  ) ||
                  listC[0];
              }
            }

            if (picked?.id) {
              placeId = picked.id;
              console.log(
                "... ✅ Picked placeId:",
                placeId,
                "| name:",
                picked.displayName
              );
              break;
            }
          }

          if (!placeId) {
            throw new Error(
              "Could not determine placeId from search. " +
                "Open Google’s Place ID Finder sample and try the address manually: " +
                "https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
            );
          }
        }

        if (cancelled) return;
        setResolvedPlaceId(placeId);

        // STEP 6: Fetch details + reviews
        setStep(6);
        console.log("[STEP 6] Fetch details & reviews for:", placeId);
        const placeObj = new Place({ id: placeId });
        await placeObj.fetchFields({
          fields: [
            "displayName",
            "formattedAddress",
            "location",
            "rating",
            "userRatingCount",
            "reviews", // include reviews explicitly
            "googleMapsURI",
          ],
        });
        console.log("... details fetched:", {
          name: placeObj.displayName,
          address: placeObj.formattedAddress,
          rating: placeObj.rating,
          userRatingCount: placeObj.userRatingCount,
          reviews: Array.isArray(placeObj.reviews)
            ? placeObj.reviews.length
            : 0,
          hasLatLng: !!(placeObj.location?.lat && placeObj.location?.lng),
        });

        if (cancelled) return;
        setPlace(placeObj);

        // STEP 7: Done
        setStep(7);
        console.log("[STEP 7] Render UI");
      } catch (e) {
        console.error("[ERROR]", e);
        setError(e?.message || String(e));
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [API_KEY, HARDCODED_PLACE_ID, queries]);

  // --- RENDER ---
  if (error) {
    return (
      <div className="p-4 text-red-700">
        Failed to fetch details. {error}
        <div className="mt-2 text-sm">
          Quick checks:
          <ul className="list-disc ml-5">
            <li>
              Enable <b>Places API (New)</b> & <b>Maps JavaScript API</b>
            </li>
            <li>
              Key referrers include <code>http://localhost:5173/*</code>
            </li>
            <li>If you just enabled, give it a couple of minutes and retry</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="p-4">
        Step: <b>{step}</b> — Searching… open DevTools Console for step-by-step
        logs.
      </div>
    );
  }

  const lat = place.location?.lat?.();
  const lng = place.location?.lng?.();
  const reviews = Array.isArray(place.reviews) ? place.reviews : [];

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <div className="text-xs rounded bg-gray-100 p-2">
        <div>
          <b>Step:</b> {step}{" "}
          {resolvedPlaceId ? `| placeId: ${resolvedPlaceId}` : ""}
        </div>
        <div className="text-gray-600">(See console for detailed logs)</div>
      </div>

      <header>
        <h2 className="text-xl font-semibold">{place.displayName}</h2>
        <div className="text-sm text-gray-600">{place.formattedAddress}</div>
        {typeof lat === "number" && typeof lng === "number" && (
          <div className="text-sm text-gray-600">
            Lat/Lng: {lat.toFixed(6)}, {lng.toFixed(6)}
          </div>
        )}
        {(place.rating || place.userRatingCount) && (
          <div className="mt-2 text-sm">
            <b>{place.rating ?? "-"}</b> / 5
            {place.userRatingCount ? ` (${place.userRatingCount} reviews)` : ""}
            {place.googleMapsURI && (
              <>
                {" "}
                •{" "}
                <a
                  href={place.googleMapsURI}
                  target="_blank"
                  rel="noreferrer"
                  className="underline">
                  View on Google Maps
                </a>
              </>
            )}
          </div>
        )}
      </header>

      <section>
        <h3 className="font-medium mb-2">Latest Reviews</h3>
        {reviews.length === 0 ? (
          <div className="text-sm text-gray-600">No reviews available.</div>
        ) : (
          <ul className="space-y-3">
            {reviews.slice(0, 5).map((r, i) => (
              <li key={i} className="border rounded-lg p-3">
                <div className="text-sm">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">
                      {r.authorAttribution?.displayName || "Anonymous"}
                    </span>
                    {r.authorAttribution?.uri && (
                      <a
                        href={r.authorAttribution.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-xs">
                        Profile
                      </a>
                    )}
                    {typeof r.rating === "number" && (
                      <span className="text-xs">• {r.rating}★</span>
                    )}
                    {r.relativePublishTimeDescription && (
                      <span className="text-xs text-gray-500">
                        • {r.relativePublishTimeDescription}
                      </span>
                    )}
                  </div>
                  {r.text && <p className="mt-1">{r.text}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ReviewFetch;
