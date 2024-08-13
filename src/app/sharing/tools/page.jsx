import Image from "next/image";

export default function Tools() {
  return (
    <main
      className={`fix-h-screen min-w-screen overflow-hidden bg-oldwhite relative`}
    >
      <div className="rotate-90 md:rotate-0 absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-orange">
        <h2 className="absolute -top-2.5 font-bold">Nuestras</h2>
        <h1 className="text-9xl font-semibold">Tecnologías</h1>
      </div>
      <Manage />
    </main>
  );
}

function Manage() {
  const valuesStyles = {
    scale: ["50", "75", "90", "125", "150", "105"],
    delay: ["-1s", "-1.5s", "-1s", "-2s", "-3s"],
    position: [
      "bottom-0 start-0",
      "bottom-1/4 start-1/4",
      "bottom-6 end-6",
      "end-0 top-0",
      "top-0 start-1/4",
      "top-1/4 end-1/4",
      "top-6 start-6",
      "bottom-1/2 start-1/2",
      "top-1/2 end-1/2",
      "bottom-1/2 end-0",
      "top-1/4 end-1/2",
      "bottom-0 end-1/4",
      "top-0 start-1/2",
      "bottom-6 start-1/2",
      "top-1/2 start-1/4",
      "bottom-1/4 end-6",
      "top-6 end-1/4",
      "bottom-1/2 start-0",
      "top-0 end-1/4",
      "bottom-1/4 start-6",
      "top-6 start-0",
      "bottom-1/4 end-1/2",
      "top-0 start-6",
      "bottom-1/2 end-1/4",
      "top-6 end-0",
      "bottom-1/2 start-1/4",
      "top-1/2 end-6",
    ],
    animation: [
      "bounceFromTopLeft",
      "bounceFromTopRight",
      "bounceFromBottomLeft",
      "bounceFromBottomRight",
      "bounceDiagonalSlow",
      "bounceHorizontalFast",
      "bounceVerticalSlow",
      "bounceZigZag",
    ],
  };

  const bubbles = [
    { name: "randy", image: "/tools/randy.webp" },
    { name: "aws", image: "/tools/aws.webp" },
    { name: "bcrypt", image: "/tools/bcrypt.webp" },
    { name: "clerk", image: "/tools/clerk.webp" },
    { name: "cloudfront", image: "/tools/cloudfront.webp" },
    { name: "cors", image: "/tools/cors.webp" },
    { name: "dotenv", image: "/tools/dotenv.webp" },
    { name: "ec2", image: "/tools/ec2.webp" },
    { name: "eslint", image: "/tools/eslint.webp" },
    { name: "express", image: "/tools/express.webp" },
    { name: "jwt", image: "/tools/jwt.webp" },
    { name: "mongodb", image: "/tools/mongodb.webp" },
    { name: "namecheap", image: "/tools/namecheap.webp" },
    { name: "next", image: "/tools/next.webp" },
    { name: "resend", image: "/tools/resend.webp" },
    { name: "s3", image: "/tools/s3.webp" },
    { name: "tailwind", image: "/tools/tailwind.webp" },
    { name: "vercel", image: "/tools/vercel.webp" },
    { name: "webpack", image: "/tools/webpack.webp" },
  ];

  const handlerRandom = (arr) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  return (
    <>
      <style>
        {`
          @keyframes bounceFromTopLeft {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(calc(100vw - 200px), calc(100vh - 200px));
          }
        }

        @keyframes bounceFromTopRight {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(calc(-100vw + 200px), calc(100vh - 200px));
          }
        }

        @keyframes bounceFromBottomLeft {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(calc(100vw - 200px), calc(-100vh + 200px));
          }
        }

        @keyframes bounceFromBottomRight {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(calc(-100vw + 200px), calc(-100vh + 200px));
          }
        }

        /* Variaciones adicionales */

        @keyframes bounceDiagonalSlow {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(calc(100vw - 200px), calc(100vh - 200px));
          }
        }

        @keyframes bounceHorizontalFast {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(calc(100vw - 200px));
          }
        }

        @keyframes bounceVerticalSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(calc(100vh - 200px));
          }
        }

        @keyframes bounceZigZag {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(calc(100vw - 200px), 0);
          }
          50% {
            transform: translate(calc(100vw - 200px), calc(100vh - 200px));
          }
          75% {
            transform: translate(0, calc(100vh - 200px));
          }
          100% {
            transform: translate(0, 0);
          }
        }
  
        `}
      </style>

      {bubbles.map(({ name, image }, index) => (
        <Bubble
          key={`bubble-${index}`}
          delay={handlerRandom(valuesStyles.delay)}
          position={handlerRandom(valuesStyles.position)}
          scale={handlerRandom(valuesStyles.scale)}
          animation={handlerRandom(valuesStyles.animation)}
          image={image}
          name={name}
        />
      ))}
    </>
  );
}

function Bubble({ delay, position, scale, animation, image, name }) {
  const path = "https://cdn.randomlandia.com";
  return (
    <div
      className={`absolute ${position} w-[200px] h-[200px] rounded-full shadow-[inset_0_0_25px_rgba(255,255,255,0.25)] scale-${scale} flex justify-center items-center blur-[.9px] p-10 shadow-2xl shadow-yellow-600/30`}
      style={{
        animation: `${animation} 20s ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      <Image
        src={`${path}${image}`}
        height={100}
        width={100}
        alt={name}
      />
    </div>
  );
}
