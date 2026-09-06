import React from "react";

function CargoShip({
  size = 180,
  className = "",
  animated = false,
}) {
  return (
    <div
      className={`cargo-ship ${animated ? "cargo-ship-moving" : ""} ${className}`}
      style={{
        width: size,
        height: size * 0.65,
      }}
    >
      <svg
        viewBox="0 0 500 300"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >

        {/* =====================================
            GLOW
        ===================================== */}

        <defs>

          <filter
            id="shipGlow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur
              stdDeviation="8"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>


          {/* Hull gradient */}

          <linearGradient
            id="hullGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#e9f4f7"
            />

            <stop
              offset="45%"
              stopColor="#9fb9c4"
            />

            <stop
              offset="100%"
              stopColor="#304854"
            />
          </linearGradient>


          {/* Red hull */}

          <linearGradient
            id="redHull"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#f05b5b"
            />

            <stop
              offset="100%"
              stopColor="#7f2028"
            />
          </linearGradient>


          {/* Deck */}

          <linearGradient
            id="deckGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#233943"
            />

            <stop
              offset="100%"
              stopColor="#101d24"
            />
          </linearGradient>

        </defs>


        {/* =====================================
            WAKE
        ===================================== */}

        <g
          opacity="0.45"
          filter="url(#shipGlow)"
        >

          <path
            d="M65 235 C30 245 20 265 5 275"
            fill="none"
            stroke="#39e8ff"
            strokeWidth="5"
          />

          <path
            d="M95 240 C60 260 50 275 30 290"
            fill="none"
            stroke="#39e8ff"
            strokeWidth="3"
          />

          <path
            d="M120 242 C95 260 85 275 75 290"
            fill="none"
            stroke="#39e8ff"
            strokeWidth="2"
          />

        </g>


        {/* =====================================
            MAIN HULL
        ===================================== */}

        <path
          d="
            M65 205
            L410 205
            L455 220
            L420 250
            L105 250
            L65 225
            Z
          "
          fill="url(#hullGradient)"
          stroke="#172b35"
          strokeWidth="4"
        />


        {/* =====================================
            RED LOWER HULL
        ===================================== */}

        <path
          d="
            M65 225
            L455 220
            L420 250
            L105 250
            Z
          "
          fill="url(#redHull)"
        />


        {/* =====================================
            HULL WATERLINE
        ===================================== */}

        <path
          d="
            M78 222
            L440 218
          "
          stroke="#e8faff"
          strokeWidth="3"
          opacity="0.7"
        />


        {/* =====================================
            DECK
        ===================================== */}

        <path
          d="
            M78 198
            L390 198
            L430 214
            L68 214
            Z
          "
          fill="url(#deckGradient)"
          stroke="#07151d"
          strokeWidth="3"
        />


        {/* =====================================
            CONTAINER STACKS
        ===================================== */}

        {/* Row 1 */}

        <g>

          <rect
            x="115"
            y="155"
            width="48"
            height="42"
            rx="2"
            fill="#d85b45"
          />

          <rect
            x="166"
            y="155"
            width="48"
            height="42"
            rx="2"
            fill="#397ca0"
          />

          <rect
            x="217"
            y="155"
            width="48"
            height="42"
            rx="2"
            fill="#e18a3a"
          />

          <rect
            x="268"
            y="155"
            width="48"
            height="42"
            rx="2"
            fill="#4a8c68"
          />

          <rect
            x="319"
            y="155"
            width="48"
            height="42"
            rx="2"
            fill="#a95353"
          />

        </g>


        {/* Row 2 */}

        <g>

          <rect
            x="115"
            y="116"
            width="48"
            height="38"
            rx="2"
            fill="#477fa0"
          />

          <rect
            x="166"
            y="116"
            width="48"
            height="38"
            rx="2"
            fill="#d86b45"
          />

          <rect
            x="217"
            y="116"
            width="48"
            height="38"
            rx="2"
            fill="#3c8b70"
          />

          <rect
            x="268"
            y="116"
            width="48"
            height="38"
            rx="2"
            fill="#d88b3e"
          />

          <rect
            x="319"
            y="116"
            width="48"
            height="38"
            rx="2"
            fill="#4c7795"
          />

        </g>


        {/* =====================================
            CONTAINER LINES
        ===================================== */}

        <g
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.25"
        >

          <line
            x1="139"
            y1="116"
            x2="139"
            y2="197"
          />

          <line
            x1="190"
            y1="116"
            x2="190"
            y2="197"
          />

          <line
            x1="241"
            y1="116"
            x2="241"
            y2="197"
          />

          <line
            x1="292"
            y1="116"
            x2="292"
            y2="197"
          />

          <line
            x1="343"
            y1="116"
            x2="343"
            y2="197"
          />

        </g>


        {/* =====================================
            BRIDGE / SUPERSTRUCTURE
        ===================================== */}

        <g>

          <path
            d="
              M365 195
              L365 105
              L390 80
              L430 80
              L445 105
              L445 195
              Z
            "
            fill="#eef7fa"
            stroke="#1c323d"
            strokeWidth="4"
          />


          {/* Bridge windows */}

          <g fill="#173a49">

            <rect
              x="373"
              y="108"
              width="13"
              height="12"
            />

            <rect
              x="389"
              y="108"
              width="13"
              height="12"
            />

            <rect
              x="405"
              y="108"
              width="13"
              height="12"
            />

            <rect
              x="421"
              y="108"
              width="13"
              height="12"
            />

          </g>


          {/* Lower windows */}

          <g fill="#244957">

            <rect
              x="373"
              y="127"
              width="61"
              height="8"
            />

            <rect
              x="373"
              y="141"
              width="61"
              height="8"
            />

          </g>

        </g>


        {/* =====================================
            FUNNEL
        ===================================== */}

        <path
          d="
            M392 80
            L392 48
            L420 48
            L425 80
            Z
          "
          fill="#374d57"
        />


        {/* Funnel top */}

        <ellipse
          cx="406"
          cy="48"
          rx="14"
          ry="5"
          fill="#172932"
        />


        {/* =====================================
            RADAR / MAST
        ===================================== */}

        <line
          x1="412"
          y1="48"
          x2="412"
          y2="25"
          stroke="#d8f4fa"
          strokeWidth="3"
        />


        <line
          x1="412"
          y1="31"
          x2="430"
          y2="31"
          stroke="#d8f4fa"
          strokeWidth="2"
        />


        {/* =====================================
            FRONT DECK
        ===================================== */}

        <path
          d="
            M75 198
            L105 198
            L105 177
            L75 177
            Z
          "
          fill="#dcebef"
        />


        {/* =====================================
            BOW
        ===================================== */}

        <path
          d="
            M65 205
            L40 220
            L65 225
            Z
          "
          fill="#dcebef"
        />


        {/* =====================================
            SHIP LIGHT
        ===================================== */}

        <circle
          cx="420"
          cy="72"
          r="4"
          fill="#45efff"
          filter="url(#shipGlow)"
        />

      </svg>
    </div>
  );
}


export default CargoShip;