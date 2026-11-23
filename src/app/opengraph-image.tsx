import { ImageResponse } from "next/og";

export const alt = "Aswin Krishna | Toronto Photographer";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          border: "1px solid #26241f",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              color: "#c8a96a",
              fontSize: "20px",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            Photography Portfolio
          </span>
          <span
            style={{
              color: "#8a8780",
              fontSize: "18px",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Toronto, Ontario, Canada
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              fontSize: "100px",
              color: "#f2efe9",
              margin: "0",
              lineHeight: "0.9",
              fontWeight: 800,
              letterSpacing: "2px",
            }}
          >
            ASWIN KRISHNA
          </h1>
          <p
            style={{
              fontSize: "32px",
              color: "#8a8780",
              marginTop: "20px",
              fontStyle: "italic",
            }}
          >
            Nature · Weddings · Everyday Moments
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #26241f",
            paddingTop: "24px",
            color: "#8a8780",
            fontSize: "16px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <span>flicksbykarol aesthetic · cinematic storytelling</span>
          <span style={{ color: "#c8a96a" }}>aswinkrishna.photography</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
