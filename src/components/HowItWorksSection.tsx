'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animated';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full bg-[#21A0A3] text-white py-20 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        {/* Left Column: Heading, Paragraph & CTA */}
        <FadeIn direction="up" className="lg:col-span-5 flex flex-col items-start lg:sticky lg:top-24">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
            How It Works
          </h2>

          <p className="mt-6 text-base sm:text-lg text-teal-100/90 leading-relaxed max-w-md">
            Not sure what your digital presence needs next? We help you find the right starting point before the work begins.
          </p>

          {/* Single Action Button */}
          <div className="mt-8">
            <Link href="/book-a-call" className="btn-hover-gradient group px-7 py-3.5 rounded-full bg-[#A7F176] text-[#111827] font-semibold text-sm sm:text-base inline-flex items-center gap-3 shadow-md hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
              <span>Book a Discovery Call</span>
              <span className="w-6 h-6 rounded-full bg-black/10 group-hover:bg-white/20 flex items-center justify-center text-xs group-hover:rotate-45 transition-all duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </FadeIn>

        {/* Right Column: Timeline & 4 Steps */}
        <div className="lg:col-span-7 relative pl-6 sm:pl-10">
          
          {/* Vertical Timeline Line */}
          <div className="absolute left-[11px] sm:left-[19px] top-3 bottom-12 w-[1.5px] bg-white/30"></div>

          <StaggerContainer className="flex flex-col gap-14 sm:gap-16">
            
            {/* Step 1 */}
            <StaggerItem className="relative pl-8 sm:pl-12">
              <div className="absolute -left-[19px] sm:-left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#21A0A3] shadow-sm"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-teal-100/80 uppercase block mb-3">STEP 1</span>
              <div className="mb-4 text-[#A7F176]">
                <svg width="40" height="40" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.9238 46C38.0784 46 33.1104 44.7867 28.0198 42.3602C22.9291 39.9338 18.1997 36.5269 13.8316 32.1396C9.46354 27.7524 6.06625 23.023 3.63975 17.9515C1.21325 12.88 0 7.92158 0 3.07625C0 2.19842 0.287501 1.46721 0.862501 0.882625C1.4375 0.298042 2.15625 0.00383333 3.01875 0H10.1286C10.9106 0 11.593 0.246292 12.1756 0.738875C12.7583 1.23146 13.1522 1.863 13.3573 2.6335L14.7833 9.4875C14.9174 10.2925 14.8935 10.995 14.7114 11.5949C14.5293 12.1948 14.2102 12.6864 13.754 13.0697L7.44625 18.952C8.62692 21.0929 9.93121 23.0824 11.3591 24.9205C12.787 26.7586 14.3108 28.4999 15.9304 30.1444C17.5979 31.8119 19.3938 33.3644 21.3181 34.8019C23.2425 36.2375 25.3546 37.5925 27.6546 38.8671L33.8043 32.6082C34.2719 32.1042 34.798 31.7716 35.3826 31.6106C35.9653 31.4515 36.6112 31.4199 37.3204 31.5157L43.3665 32.752C44.1485 32.9437 44.7829 33.3375 45.2698 33.9336C45.7566 34.5297 46 35.212 46 35.9806V42.9813C46 43.8438 45.7067 44.5625 45.1203 45.1375C44.5338 45.7125 43.7997 46 42.9238 46ZM6.095 16.2553L11.615 11.1809C11.7971 11.0333 11.9159 10.8301 11.9715 10.5714C12.029 10.3126 12.0194 10.073 11.9428 9.85262L10.6691 3.75763C10.5944 3.46438 10.465 3.24396 10.281 3.09638C10.097 2.94879 9.85838 2.875 9.56513 2.875H3.66563C3.44521 2.875 3.26121 2.94879 3.11363 3.09638C2.96604 3.24396 2.89225 3.42796 2.89225 3.64838C2.94783 5.61296 3.25546 7.66379 3.81513 9.80087C4.37479 11.938 5.13283 14.0894 6.095 16.2553ZM30.3916 40.2155C32.3351 41.1777 34.4051 41.8897 36.6016 42.3516C38.802 42.8116 40.7186 43.0579 42.3516 43.0905C42.572 43.0905 42.756 43.0167 42.9036 42.8691C43.0512 42.7215 43.125 42.5385 43.125 42.32V36.547C43.125 36.2537 43.0512 36.0142 42.9036 35.8283C42.756 35.6442 42.5356 35.5158 42.2424 35.443L36.9236 34.3534C36.7013 34.2786 36.5067 34.269 36.34 34.3246C36.1752 34.3821 36.0007 34.5019 35.8167 34.684L30.3916 40.2155Z" fill="#A7F176"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Book a Discovery Call</h3>
              <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-lg">We talk through your business, current digital presence, goals, problems, and what you want to improve first.</p>
            </StaggerItem>

            {/* Step 2 */}
            <StaggerItem className="relative pl-8 sm:pl-12">
              <div className="absolute -left-[19px] sm:-left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#21A0A3] shadow-sm"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-teal-100/80 uppercase block mb-3">STEP 2</span>
              <div className="mb-4 text-[#A7F176]">
                <svg width="40" height="40" viewBox="0 0 49 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44.786 21C41.7179 21 40.0815 23.8 40.8997 26L33.536 33.2C32.9224 33 32.1042 33 31.4906 33.2L26.1724 28C26.9906 25.8 25.3542 23 22.286 23C19.4224 23 17.5815 25.8 18.3997 28L8.99059 37C6.74059 36.4 3.87695 38 3.87695 41C3.87695 43.2 5.71786 45 7.96786 45C10.8315 45 12.6724 42.2 11.8542 40L21.0588 30.8C21.6724 31 22.4906 31 23.1042 30.8L28.4224 36C27.8088 38 29.4451 41 32.5133 41C35.5815 41 37.2179 38.2 36.3997 36L43.7633 28.8C46.0133 29.4 48.877 27.8 48.877 25C48.877 22.8 47.036 21 44.786 21ZM32.5133 23L34.3542 18.8L38.6497 17L34.3542 15.2L32.5133 11L30.6724 15.2L26.377 17L30.6724 18.8L32.5133 23ZM8.99059 27L10.0133 23L14.1042 22L10.0133 21L8.99059 17L7.96786 21L3.87695 22L7.96786 23L8.99059 27Z" fill="#A7F176"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">We Find the Opportunity</h3>
              <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-lg">We review what you need, where the gaps are, and which services can make the strongest impact. You get a practical direction with scope, timelines, and budget range.</p>
            </StaggerItem>

            {/* Step 3 */}
            <StaggerItem className="relative pl-8 sm:pl-12">
              <div className="absolute -left-[19px] sm:-left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#21A0A3] shadow-sm"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-teal-100/80 uppercase block mb-3">STEP 3</span>
              <div className="mb-4 text-[#A7F176]">
                <svg width="40" height="40" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.8125 9.1875C38.144 10.7835 36.1598 12.0124 33.9876 12.7951C31.6969 13.1994 25.3575 10.2594 22.2338 13.2606C21.7131 13.7812 21.07 14.3019 20.3963 14.8225C18.9263 14.1794 16.66 13.1994 15.0063 12.25C13.3525 11.3006 9.1875 9.1875 9.1875 9.1875L0 19.9063C0 19.9063 2.26625 22.9688 3.675 24.99C4.59375 26.3375 5.72688 28.3894 6.46187 29.7675L5.42063 30.9925C5.17305 31.4883 5.08432 32.0483 5.16652 32.5963C5.24872 33.1443 5.49786 33.6537 5.88 34.055C6.3223 34.3885 6.86142 34.5683 7.41534 34.5672C7.96926 34.5661 8.50766 34.3841 8.94863 34.0489C8.78489 34.2406 8.66098 34.463 8.58411 34.7031C8.50724 34.9432 8.47895 35.1962 8.5009 35.4473C8.52285 35.6985 8.5946 35.9428 8.71196 36.1659C8.82931 36.389 8.98993 36.5865 9.18444 36.7469C9.65272 37.0182 10.1845 37.1606 10.7257 37.1595C11.2669 37.1584 11.7981 37.014 12.2653 36.7408C11.9154 37.177 11.7239 37.719 11.7223 38.2781C11.7206 38.8373 11.9088 39.3804 12.2561 39.8186C12.7075 39.9754 13.189 40.0254 13.663 39.9649C14.137 39.9043 14.5904 39.7347 14.9879 39.4695C14.7889 39.9382 14.7371 40.4563 14.8394 40.9552C14.9417 41.454 15.1932 41.9099 15.5606 42.2625C16.0789 42.4907 16.6464 42.5844 17.2106 42.5352C17.7748 42.4859 18.3175 42.2953 18.7884 41.9808L20.3687 40.5506C21.8142 41.9899 23.8079 42.8811 26.0098 42.8811L26.1966 42.8781C26.9224 42.8165 27.6177 42.5584 28.2079 42.1317C28.7981 41.7049 29.261 41.1255 29.547 40.4556C29.9941 40.6271 30.5025 40.7435 31.0415 40.7435C31.7643 40.7435 32.4349 40.5353 33.0015 40.1769C34.7931 38.9918 34.3643 38.073 34.3643 38.073C35.0014 38.3472 35.709 38.4122 36.3854 38.2587C37.0617 38.1052 37.6719 37.741 38.1281 37.2186C38.6022 36.7336 38.9011 36.1045 38.9777 35.4306C39.0542 34.7567 38.904 34.0766 38.5508 33.4976C38.5704 33.5085 38.5926 33.5138 38.6151 33.5129C39.9044 33.5129 41.0253 32.8024 41.6102 31.7551C41.8992 31.0109 41.997 30.2061 41.8948 29.4143C41.7927 28.6226 41.4937 27.869 41.0253 27.2226L41.0344 27.2379C43.5457 26.7479 43.4538 25.4923 44.6788 23.6548C45.8372 22.1539 47.2808 20.8966 48.9265 19.9552L39.8125 9.1875Z" fill="#A7F176"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">We Shape the Plan</h3>
              <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-lg">We refine the priorities, ask the right questions, and agree on the best way forward before anything is signed.</p>
            </StaggerItem>

            {/* Step 4 */}
            <StaggerItem className="relative pl-8 sm:pl-12">
              <div className="absolute -left-[19px] sm:-left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#21A0A3] shadow-sm"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-teal-100/80 uppercase block mb-3">STEP 4</span>
              <div className="mb-4 text-[#A7F176]">
                <svg width="40" height="40" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M46.0126 0L45.0149 0.0293448C45.0149 0.0293448 38.1115 0.121047 31.4576 3.43334C29.3191 4.50075 27.1696 5.96432 25.2365 7.89374C22.8559 10.2743 19.4959 14.1809 16.4331 17.871H8.42195C8.3926 17.871 8.36326 17.871 8.33391 17.871C8.08081 17.8966 7.84606 18.0214 7.68833 18.2231L2.99317 23.8573C2.79509 24.1067 2.73273 24.4405 2.83544 24.7413C2.93448 25.0421 3.18391 25.2732 3.49203 25.3539L9.21425 26.7918C9.17024 26.8468 8.89146 27.2026 8.89146 27.2026L8.77408 27.32L8.71539 27.496C8.71539 27.496 8.6347 27.8262 8.6567 28.1416C8.66404 28.259 8.68605 28.4131 8.71539 28.5525L6.69061 31.9564C6.69061 31.9564 6.5989 32.1399 6.57323 32.2499C6.54755 32.3599 6.54021 32.4957 6.54388 32.6314C6.55122 32.9028 6.61724 33.2073 6.77864 33.5704C7.10143 34.2967 7.79103 35.2577 9.27294 36.7396C10.7549 38.2179 11.7122 38.9112 12.4422 39.2339C12.8053 39.3953 13.1098 39.4614 13.3812 39.4687C13.5169 39.4724 13.6526 39.465 13.7627 39.49C13.8727 39.4137 14.0561 39.322 14.0561 39.322L17.4895 37.2972C17.6179 37.3229 17.7646 37.3485 17.871 37.3559C18.1864 37.3779 18.5165 37.2972 18.5165 37.2972L18.6926 37.2385L18.8393 37.1211C18.8393 37.1211 19.1731 36.8644 19.2208 36.8277L20.6587 42.5206C20.7394 42.8287 20.9705 43.0781 21.2713 43.1771C21.5721 43.2799 21.9059 43.2175 22.1553 43.0194L27.7895 38.3243C28.0132 38.1445 28.1416 37.8768 28.1416 37.5906V29.5502C31.8574 26.4616 35.7896 23.1053 38.1188 20.7761C40.0409 18.8503 41.4825 16.6972 42.5499 14.555C45.8475 7.91208 45.9832 0.997722 45.9832 0.997722L46.0126 0Z" fill="#A7F176"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">We Start the Work</h3>
              <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-lg">Once the proposal is approved, we move ahead with a defined scope, shared responsibilities, and a focused plan of action.</p>
            </StaggerItem>

          </StaggerContainer>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
