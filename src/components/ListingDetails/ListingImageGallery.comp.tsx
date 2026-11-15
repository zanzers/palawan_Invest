"use client";

import { useEffect, useState } from "react";
import type { TouchEvent, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeftIcon,
  PencilSimpleIcon,
  TrashIcon,
  ImageSquareIcon,
} from "@phosphor-icons/react";

import type { ListingImage } from "@/type/listingType";

type ListingImageProps = {
  images: ListingImage[];
  title: string;
};

export default function ListingImageGallery({
  images,
  title,
}: ListingImageProps) {
  const [isGalleryReady, setIsGalleryReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const hasImages = images.length > 0;
  const activeImage = images[activeIndex];

  // PRELOAD ALL IMAGES
useEffect(() => {
  let cancelled = false;

  const preloadImages = async () => {
    const preloadTasks = images.map((item) => {
      return new Promise<void>((resolve) => {
        const img = new window.Image();
        let completed = false;

        const finish = () => {
          if (completed) return;

          completed = true;
          clearTimeout(timeout);
          resolve();
        };

        const timeout = setTimeout(() => {
          console.warn("Image loading timeout:", item.imageUrl);
          finish();
        }, 10000);

        img.onload = async () => {
          try {
            await img.decode();
          } catch {
            // Ignore decode errors.
          }

          finish();
        };

        img.onerror = () => {
          console.error("Failed to load image:", item.imageUrl);
          finish();
        };

        img.src = item.imageUrl;

        if (img.complete) {
          finish();
        }
      });
    });

    await Promise.all(preloadTasks);

    if (!cancelled) {
      setIsGalleryReady(true);
    }
  };

  preloadImages();

  return () => {
    cancelled = true;
  };
}, [images]);

  // NEXT IMAGE
  const nextImage = () => {
    if (images.length <= 1) return;

    setActiveIndex((current) => (current + 1) % images.length);
  };

  // PREVIOUS IMAGE
  const previousImage = () => {
    if (images.length <= 1) return;

    setActiveIndex(
      (current) => (current - 1 + images.length) % images.length
    );
  };

  // MOBILE: TOUCH START
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX);
  };

  // MOBILE: TOUCH END
  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const difference = touchStart - touchEnd;

    if (Math.abs(difference) >= 50) {
      if (difference > 0) {
        nextImage();
      } else {
        previousImage();
      }
    }

    setTouchStart(null);
  };

  // DESKTOP: MOUSE DOWN
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    setDragStart(e.clientX);
  };

  // DESKTOP: MOUSE UP
  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (dragStart === null) return;

    const difference = dragStart - e.clientX;

    if (Math.abs(difference) >= 50) {
      if (difference > 0) {
        nextImage();
      } else {
        previousImage();
      }
    }

    setDragStart(null);
  };

  // DESKTOP: MOUSE LEAVE
  const handleMouseLeave = () => {
    setDragStart(null);
  };

  // LOADING STATE
  if (!isGalleryReady) {
    return (
      <div className="flex h-[320px] w-full animate-pulse items-center justify-center bg-slate-200 sm:h-[400px]">
        <p className="text-sm text-slate-500">
          Loading property images...
        </p>
      </div>
    );
  }

  return (
    <section className="relative isolate w-full overflow-hidden bg-slate-200">

      {/* MAIN IMAGE */}
      <div
        className="relative z-0 h-[320px] w-full cursor-grab overflow-hidden active:cursor-grabbing touch-pan-y sm:h-[400px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {hasImages && activeImage ? (
          <Image
            key={activeImage.id}
            src={activeImage.imageUrl}
            alt={`${title} - image ${activeIndex + 1}`}
            fill
            priority
            unoptimized
            sizes="100vw"
            draggable={false}
            className="select-none object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <ImageSquareIcon size={64} weight="light" />
          </div>
        )}

        {/* IMAGE OVERLAY */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/20" />
      </div>

      {/* TOP CONTROLS */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">

        {/* BACK BUTTON */}
        <Link
          href="/dashboard"
          aria-label="Go back"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md transition hover:bg-white"
        >
          <ArrowLeftIcon size={22} weight="bold" />
        </Link>

        {/* EDIT / DELETE */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            title="Edit coming soon"
            aria-label="Edit listing"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-70 shadow-md"
          >
            <PencilSimpleIcon size={20} weight="bold" />
          </button>

          <button
            type="button"
            disabled
            title="Delete coming soon"
            aria-label="Delete listing"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-70 shadow-md"
          >
            <TrashIcon size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* IMAGE COUNTER */}
      {hasImages && (
        <div className="absolute bottom-12 right-4 z-20 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
          {activeIndex + 1}/{images.length}
        </div>
      )}

    </section>
  );
}