"use client";

import Image from "next/image";
import { Great_Vibes } from "next/font/google";
import { Marmelad } from "next/font/google";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import CircularText from "@/components/CircularText";
import {
  CheckIcon,
  ChevronDownIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/16/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import BlurText from "@/components/BlurText";
import SplitText from "@/components/SplitText";
import ringsAnimation from "@/public/rings.json";
import Lottie from "lottie-react";
import ShiftingCountdown from "@/components/Countdown";
import { Loader2Icon } from "lucide-react";
gsap.registerPlugin(ScrollToPlugin);

const APP_URL =
  "https://script.google.com/macros/s/AKfycbzOJhbvhqADXopM3S5VvyTCcfU1wmClwKpQ-9_92986I2EWPszapYqo0MEx0mmga_fY/exec";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["cyrillic"],
});

const marmelad = Marmelad({
  weight: "400",
  subsets: ["cyrillic"],
});

export default function Home() {
  const mainRef = useRef();
  const audioRef = useRef();

  const [name, setName] = useState("");
  const [status, setStatus] = useState("single");
  const [soundOn, setSoundOn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isKaz, setIsKaz] = useState(false);
  const [noName, setNoName] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const audio = document.querySelector("audio");

    const handleVisibilityChange = () => {
      if (document.hidden && audio && !audio.paused) {
        audio.pause();
        setSoundOn(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) setLoaded(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   /* Main navigation */

  //   const ctx = gsap.context(() => {
  //     document.querySelectorAll(".anchor").forEach((anchor) => {
  //       anchor.addEventListener("click", function (e) {
  //         e.preventDefault();
  //         const targetElem = document.querySelector(
  //           e.target.getAttribute("href")
  //         );
  //         gsap.to(window, {
  //           scrollTo: {
  //             y: targetElem,
  //             autoKill: false,
  //           },
  //           duration: 1,
  //         });
  //       });
  //     });
  //   }, mainRef);

  //   return () => ctx.revert();
  // }, []);

  const handlePost = async (event) => {
    event.preventDefault();
    const date = new Date();

    const inputValue = {
      Name: name,
      Status: status === "single" ? 1 : status === "plus" ? 2 : 0,
      "Created At": date.toLocaleString(),
    };
    console.log(inputValue);

    if (!name.length) {
      setNoName(true);
      return;
    }

    const formData = new FormData();
    Object.keys(inputValue).forEach((key) => {
      formData.append(key, inputValue[key]);
    });
    setLoading(true);
    try {
      const res = await fetch(APP_URL, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        console.log("Request was successful:", res);
        setSubmitted(true);
      } else {
        console.log("Request Failed:", res);
      }
      setNoName(false);
    } catch (e) {
      console.error("Error during fetch:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {loaded ? (
        <motion.div
          key="page"
          initial={{ opacity: 0, y: "0%" }}
          animate={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className={`flex flex-col items-center justify-items-center 
      ${marmelad.className} text-[#444F1E] w-full`}
          onAnimationComplete={() => {
            const ctx = gsap.context(() => {
              document.querySelectorAll(".anchor").forEach((anchor) => {
                anchor.addEventListener("click", function (e) {
                  e.preventDefault();
                  const targetElem = document.querySelector(
                    e.target.getAttribute("href")
                  );
                  gsap.to(window, {
                    scrollTo: {
                      y: targetElem,
                      autoKill: false,
                    },
                    duration: 1,
                  });
                });
              });
            }, mainRef);

            return () => ctx.revert();
          }}
        >
          <main className="flex flex-col items-center w-full relative">
            <div className="absolute top-4 left-4 z-10">
              <CircularText
                text="КЛИКАЙ*ДЛЯ*ЗВУКА*"
                onHover="speedUp"
                spinDuration={20}
                className="custom-class"
              />
            </div>
            <div
              className="absolute lg:top-12 lg:left-12 top-10 left-10 z-10 cursor-pointer"
              onClick={() => {
                if (!soundOn) {
                  audioRef.current.volume = 0.5;
                  audioRef.current.play();
                } else {
                  audioRef.current.pause();
                }
                setSoundOn(!soundOn);
              }}
            >
              <audio ref={audioRef} src="/song.mp3" />
              {soundOn ? (
                <SpeakerWaveIcon className="lg:h-8 h-6" />
              ) : (
                <SpeakerXMarkIcon className="lg:h-8 h-6" />
              )}
            </div>
            <div className="flex flex-col-reverse lg:flex-row lg:h-screen h-full w-full">
              {/* Left half - Content div */}
              <div
                id="main"
                className="panel lg:w-1/2 w-full h-screen flex items-center justify-center p-8 relative"
              >
                <div className="w-auto absolute top-0 right-0 h-1/4 -z-10">
                  {!isMobile && (
                    <Image
                      src="/flower_final.png" // Replace with your image path
                      alt="Description of image"
                      width={isMobile ? 200 : 300}
                      height={520}
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <p className="text-xl font-bold">
                    {isKaz ? "Құрметті қонақ," : "Дорогой гость,"}
                  </p>
                  <p className="text-xl text-center font-bold mb-2">
                    {isKaz
                      ? "Мақта мен Әлішер Сізді тойға шақырады!"
                      : "Макта и Алишер приглашают Вас на свадьбу!"}
                  </p>
                  {/* <SplitText
                    text={"Қуанышымызды бізбен бөлісіңіздер!"}
                    className="text-2xl"
                    delay={50}
                    duration={0.1}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                    // onLetterAnimationComplete={handleAnimationComplete}
                  /> */}
                  {/* <h1
                    className={`lg:text-9xl text-center lg:text-left text-8xl text-[#A15A4D] 
                  mb-4 mt-6 leading-28 ${greatVibes.className}`}
                  >
                    Ондасын & Аружан
                  </h1> */}

                  <BlurText
                    text="Ондасын & Аружан"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    // onAnimationComplete={handleAnimationComplete}
                    className={`lg:text-9xl lg:text-left text-7xl text-[#A15A4D] 
                  mb-4 mt-6 lg:leading-28 ${greatVibes.className}`}
                  />
                  <div className="flex flex-col gap-x-4 lg:flex-row">
                    <button
                      className="mt-4 px-6 py-3 bg-[#444F1E] text-white rounded-3xl 
                cursor-pointer hover:bg-[#636c44]"
                    >
                      <a href="#venue" className="anchor">
                        {isKaz ? "Тойдың ақпараты" : "Детали торжества"}
                      </a>
                    </button>
                    <button
                      className="mt-4 px-6 py-3 bg-[#444F1E] text-white rounded-3xl 
                cursor-pointer hover:bg-[#636c44]"
                    >
                      <a href="#response" className="anchor">
                        {isKaz
                          ? "Қатысатыныңызды растаңыз"
                          : "Ответить на приглашение"}
                      </a>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right half - Image */}
              <motion.div
                key="main_img"
                initial={{ opacity: 0, y: "0%" }}
                animate={{ opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
                className="lg:w-1/2 w-screen h-screen relative"
              >
                {isMobile && (
                  <div className="absolute bottom-16 left-[35%] z-10">
                    <ChevronDownIcon className="h-32 animate-bounce text-amber-900" />
                  </div>
                )}
                <div className="absolute flex flex-row gap-2 z-20 right-4 top-4">
                  <div
                    className={`rounded-2xl px-4  border-2 cursor-pointer hover:bg-[#efe4e2]
                    border-[#A15A4D] text-[#A15A4D] font-bold text-xl ${
                      isKaz ? "bg-background" : ""
                    }`}
                    onClick={() => setIsKaz(true)}
                  >
                    Қаз
                  </div>
                  <div
                    className={`rounded-2xl px-4  border-2 cursor-pointer hover:bg-[#efe4e2]
                    border-[#A15A4D] text-[#A15A4D] font-bold text-xl ${
                      !isKaz ? "bg-background" : ""
                    }`}
                    onClick={() => setIsKaz(false)}
                  >
                    Рус
                  </div>
                </div>

                <div className="absolute top-16 z-20 w-full px-8">
                  <ShiftingCountdown isKaz={isKaz} />
                </div>
                <Image
                  src="/IMG_7887.jpg" // Replace with your image path
                  alt="Description of image"
                  fill
                  className="object-cover"
                  onLoad={() => setLoaded(true)}
                />
              </motion.div>
            </div>
            <section className="panel h-full lg:h-screen flex flex-col-reverse lg:flex-row w-full">
              <div
                id="response"
                className="panel lg:w-1/2 w-full h-screen flex flex-col justify-center items-center relative"
              >
                <div className="w-auto absolute top-8 h-1/4  -z-10">
                  <Image
                    src="/flower_6.png" // Replace with your image path
                    alt="Description of image"
                    width={isMobile ? 300 : 450}
                    height={520}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center items-center w-full h-full px-2">
                  <Card className="w-full max-w-sm">
                    <CardHeader>
                      <CardTitle
                        className={`text-4xl text-[#A15A4D] text-center ${greatVibes.className}`}
                      >
                        {isKaz
                          ? "Тойға келесіз бе?"
                          : "Ответить на приглашение"}
                      </CardTitle>
                      {/* <CardDescription>
                  Enter your email below to login to your account
                </CardDescription> */}
                      {/* <CardAction>
                  <Button variant="link">Sign Up</Button>
                </CardAction> */}
                    </CardHeader>
                    <CardContent className={"text-[#444F1E]"}>
                      <form onSubmit={handlePost}>
                        <div className="flex flex-col gap-6">
                          <div className="grid gap-2">
                            <Label htmlFor="name">
                              {isKaz ? "Аты-жөніңіз:" : "Ваше имя"}
                            </Label>
                            <Input
                              id="name"
                              type="text"
                              placeholder={
                                isKaz ? "Аты-жөніңіз" : "Фамилия Имя"
                              }
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <RadioGroup
                            defaultValue="single"
                            value={status}
                            onValueChange={setStatus}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value="single"
                                id="r1"
                                checked={status === "single"}
                              />
                              <Label htmlFor="r1">
                                {isKaz
                                  ? "Ия, жалғыз өзім келемін"
                                  : "Я приду один(-на)"}
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value="plus"
                                id="r2"
                                checked={status === "plus"}
                              />
                              <Label htmlFor="r2">
                                {isKaz
                                  ? "Ия, жұбайыммен келемін"
                                  : "Я приду с супругой(-ом)"}
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value="cannot"
                                id="r3"
                                checked={status === "cannot"}
                              />
                              <Label htmlFor="r3">
                                {isKaz
                                  ? "Өкінішке орай келе алмаймын"
                                  : "Я не смогу придти"}
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                      <Button
                        type="submit"
                        className="w-full"
                        onClick={handlePost}
                        disabled={submitted}
                      >
                        {submitted && <CheckIcon className="h-5" />}
                        {loading ? (
                          <Loader2Icon className="animate-spin" />
                        ) : submitted ? (
                          isKaz ? (
                            "Жіберілді"
                          ) : (
                            "Отправлено"
                          )
                        ) : isKaz ? (
                          "Жауапты жіберу"
                        ) : (
                          "Отправить ответ"
                        )}
                      </Button>
                      {noName && (
                        <p className="text-red-700">
                          {isKaz
                            ? "Аты-жөніңіз бос болмауы керек!"
                            : "Имя не может быть пустым!"}
                        </p>
                      )}
                    </CardFooter>
                  </Card>
                </div>
                {isMobile && (
                  <div className="px-8 flex flex-row w-full items-center gap-4 mt-auto">
                    <hr className="my-12 h-0.5 border-t-0 bg-[#A15A4D] w-full" />
                    <HeartIcon className="h-16 text-[#A15A4D]" />
                    <hr className="my-12 h-0.5 border-t-0 bg-[#A15A4D] w-full" />
                  </div>
                )}
              </div>
              <div
                id="venue"
                className="panel lg:w-1/2 w-full h-screen flex flex-col lg:gap-8 items-center p-8 relative"
              >
                {isMobile && (
                  <div className="flex flex-row w-full items-center gap-4 -mt-14">
                    <hr className="my-12 h-0.5 border-t-0 bg-[#A15A4D] w-full" />
                    <HeartIcon className="h-16 text-[#A15A4D]" />
                    <hr className="my-12 h-0.5 border-t-0 bg-[#A15A4D] w-full" />
                  </div>
                )}
                <p
                  className={`lg:text-6xl text-4xl text-center text-[#A15A4D] ${greatVibes.className} lg:mt-8`}
                >
                  {isKaz ? "Тойдың ақпараты" : "Детали торжества"}
                </p>

                <div className="w-full h-full flex flex-col gap-4 lg:text-xl text-lg">
                  <div
                    className="flex flex-col relative
                bg-white/40 lg:gap-4 p-4 lg:p-6 bg-opacity border-2 rounded-2xl"
                  >
                    <div className="w-auto absolute lg:bottom-2/3 bottom-1/2 right-0 h-1/4  -z-10">
                      <Image
                        src="/flower_2.png" // Replace with your image path
                        alt="Description of image"
                        width={250}
                        height={520}
                        className="object-cover"
                      />
                    </div>
                    <p>
                      <span className="font-bold">
                        {isKaz ? "Той күні:" : "Дата:"}
                      </span>{" "}
                      {isKaz
                        ? "22 тамыз, 2025 жы (жұма)"
                        : "22 августа 2025 года (пятница)"}
                    </p>
                    <p>
                      <span className="font-bold">
                        {isKaz ? "Уақыты:" : "Время:"}
                      </span>{" "}
                      15:00
                    </p>
                    <div>
                      <p>
                        <span className="font-bold">
                          {isKaz ? "Мекенжайы:" : "Место проведения:"}
                        </span>{" "}
                        {isKaz
                          ? "Duman мейрамханасы (Алтын зал)"
                          : "Duman ​(Золотой зал)"}
                      </p>
                      <p>
                        {isKaz
                          ? "Қарағанды қаласы, Гапеева көшесі, 37"
                          : "город Караганда, улица Гапеева, 37"}
                        ​
                      </p>
                      <p>
                        {isKaz ? "2gis сілтемесі: " : "2gis ссылка: "}
                        <a href={"https://go.2gis.com/HuLiN"} target="_blank">
                          <span className="text-red-950">
                            https://go.2gis.com/HuLiN
                          </span>
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="h-full w-full pb-8 flex flex-col justify-center gap-4">
                    <div className="w-full h-1/2 relative border-2 rounded-2xl border-[#e9a89c]">
                      <Image
                        src="/duman_wideshot.png" // Replace with your image path
                        alt="Description of image"
                        fill
                        className="object-cover rounded-2xl p-1"
                      />
                    </div>
                    {/* {!isMobile && (
                      <div className="w-full lg:h-1/4 h-1/2 relative border-2 rounded-2xl border-[#e9a89c]">
                        <Image
                          src="/duman_inside.png" // Replace with your image path
                          alt="Description of image"
                          fill
                          className="object-cover rounded-2xl p-1"
                        />
                      </div>
                    )} */}
                    <div className="w-full h-1/2 relative border-2 rounded-2xl border-[#e9a89c]">
                      <Image
                        src="/duman.png" // Replace with your image path
                        alt="Description of image"
                        fill
                        className="object-cover rounded-2xl p-1"
                      />
                    </div>
                  </div>
                </div>
                {isMobile && (
                  <div className="flex flex-row w-full items-center gap-4 -mb-8">
                    <hr className="my-12 h-0.5 border-t-0 bg-[#A15A4D] w-full" />
                    <HeartIcon className="h-16 text-[#A15A4D]" />
                    <hr className="my-12 h-0.5 border-t-0 bg-[#A15A4D] w-full" />
                  </div>
                )}
              </div>
              {!isMobile && (
                <div className="absolute bottom-8 px-8 flex flex-row w-full items-center gap-4 -mb-8">
                  <hr className="my-12 h-0.5 border-t-0 bg-[#A15A4D] w-full" />
                  <HeartIcon className="h-16 text-[#A15A4D]" />
                  <hr className="my-12 h-0.5 border-t-0 bg-[#A15A4D] w-full" />
                </div>
              )}
            </section>
          </main>
        </motion.div>
      ) : (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1 }}
          className="bg-[#394219] z-30 absolute top-0 h-screen w-full flex flex-col justify-center items-center"
        >
          <div className="">
            <Lottie animationData={ringsAnimation} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
