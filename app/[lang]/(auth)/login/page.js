"use client";
import LogInForm from "./LogInForm";
import { Icon } from "@iconify/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import Language from "@/components/partials/header/language";
import Image from "next/image";
import img from "./dc50361d-502d-4fca-b4d9-0f655e9d067a.png"
const LoginPage = () => {
  const { theme: config, setTheme: setConfig, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  return (
    <div className="loginwrapper  bg-primary  flex  justify-center items-center">
      <div
        className="flex flex-col gap-4 justify-center bg-background my-10 p-10 2xl:my-20 m-4 w-fit overflow-hidden xl:w-[calc(100vw-80px)]   2xl:w-[calc(100vw-160px)]  2xl:px-20 2xl:py-12 rounded-3xl  
      "
      >
        {/* <div>
          <Language />
        </div> */}
        <div className="relative  rounded-xl">
          <div className="flex flex-col xl:flex-row items-center w-full gap-y-12">
            <div className="basis-full xl:basis-1/2 w-full">
              <div className="w-full  xl:w-[480px]  relative z-20">
                <LogInForm />
              </div>
            </div>
            <div className="basis-full xl:basis-1/2 hidden xl:flex justify-end items-center relative">
      <Image 
        src={img} 
        alt="login image" 
        layout="intrinsic"
        width={600} // يمكن زيادته إذا أردت تغطية مساحة أكبر
        height={600}
        className="rounded-3xl object-cover w-full h-auto"
      />
    </div>
         
         
         
            {/* <div className="basis-full xl:basis-1/2 hidden xl:block relative w-[500px] ">
              <svg
                className="absolute top-0 -right-0 "
                width="1208"
                height="580"
                viewBox="0 0 1208 1080"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_f_4801_13605)">
                  <circle
                    cx="604"
                    cy="565"
                    r="404"
                    fill="url(#paint0_radial_4801_13605)"
                  />
                </g>
              </svg>
              <div className="bg-primary h-full w-full rounded-3xl rounded-tr-none  xl:p-[60px] ltr:xl:pr-9 rtl:xl:pl-9 relative  overflow-hidden">
                <svg
                  className="absolute -top-[25px] -right-6 hidden lg:block [&>*]:fill-background"
                  width="209"
                  height="162"
                  viewBox="0 0 209 162"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M62 25H0V0H209V162H185C184.317 129.162 169.576 122.271 158.235 120.921H121.512C100.402 119.676 90.7287 104.351 90.7287 93.7286V57.8571C89.4326 35.64 71.0009 26.7357 62 25Z"
                    fill="currentColor"
                  />
                </svg>

                <div className="text-2xl lg:text-3xl xl:text-5xl font-semibold text-primary-foreground rtl:pr-12">
                  What’s Our <span className="xl:block"></span>
                  Clients Say...
                </div>

                <div className="text-xl  mt-2 text-primary-foreground flex gap-1">
                  <span>
                    <Icon
                      icon="bi:quote"
                      className="text-primary-foreground text-2xl"
                    />
                  </span>
                  DashTail is awesome friendly Admin Dashboard Template. If you
                  manage your business in online then “DashTail” is for you. Buy
                  Now & make user friendly your business today...
                </div>

                <div className="bg-card overflow-hidden w-full  rounded-3xl rounded-tr-none  relative mt-11 pt-8 pb-7 pl-4">
                  <div className="h-[72px] w-[72px] rounded-full  bg-background flex justify-center items-center absolute right-0 top-0 z-10">
                    <Icon
                      icon="heroicons:star-16-solid"
                      className="w-12 h-12 text-yellow-400"
                    />
                  </div>
                  <svg
                    className="absolute -top-[25px] -right-6 [&>*]:fill-primary"
                    width="209"
                    height="162"
                    viewBox="0 0 209 162"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M62 25H0V0H209V162H185C184.317 129.162 169.576 122.271 158.235 120.921H121.512C100.402 119.676 90.7287 104.351 90.7287 93.7286V57.8571C89.4326 35.64 71.0009 26.7357 62 25Z"
                      fill="currentColor"
                    />
                  </svg>
                  <div className="w-[90%] mx-auto">
                    <Swiper
                      key={`${isRtl}-swiper`}
                      dir={isRtl ? "rtl" : "ltr"}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[Autoplay, Pagination, Navigation]}
                      style={{
                        "--swiper-pagination-color": `hsl(${
                          theme?.cssVars[mode === "dark" ? "dark" : "light"]
                            .primary
                        })`,
                        "--swiper-pagination-bottom": "0px",
                        "--swiper-pagination-bullet-size": "12px",
                        "--swiper-pagination-bullet-inactive-color": `hsl(${
                          theme?.cssVars[mode === "dark" ? "dark" : "light"]
                            .primary
                        })`,
                        "--swiper-pagination-bullet-inactive-opacity": 0.5,
                      }}
                      className="w-full h-full rounded-2xl "
                    >
                      <SwiperSlide>
                        <div className="ltr:pl-4 rtl:pr-8 pb-10">
                          <div className="text-lg lg:text-xl  font-semibold text-default-900 pr-10">
                            Prantik Chakraborty <br />
                            <span className="text-base font-medium text-default-700">
                              {" "}
                              UI/UX Designer at Codeshaper
                            </span>
                          </div>
                          <div className="text-lg  text-default-800 mt-4">
                            The key metric of whether you&lsquo;ve succeeded is
                            what fraction of your employees use that dashboard
                            everyday.
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="ltr:pl-4 rtl:pr-8 pb-10">
                          <div className="text-lg lg:text-xl  font-semibold text-default-900 pr-10 ">
                            Prantik Chakraborty <br />
                            <span className="text-base font-medium text-default-700">
                              {" "}
                              UI/UX Designer at Codeshaper
                            </span>
                          </div>
                          <div className="text-lg  text-default-800 mt-4">
                            The key metric of whether you&#39;ve succeeded is
                            what fraction of your employees use that dashboard
                            everyday.
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="ltr:pl-4 rtl:pr-8  pb-10">
                          <div className="text-lg lg:text-xl  font-semibold text-default-900 pr-10 ">
                            Prantik Chakraborty <br />
                            <span className="text-base font-medium text-default-700">
                              {" "}
                              UI/UX Designer at Codeshaper
                            </span>
                          </div>
                          <div className="text-lg  text-default-800 mt-4">
                            The key metric of whether you&lsquo;ve succeeded is
                            what fraction of your employees use that dashboard
                            everyday.
                          </div>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
