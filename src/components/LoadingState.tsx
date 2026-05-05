import React from 'react';
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
      <div className="relative flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="w-24 h-24 rounded-full border border-[#6B8E23]/30 border-t-[#064E3B]"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="absolute w-16 h-16 rounded-full border border-[#064E3B]/30 border-b-[#6B8E23]"
        />
        <Loader2 className="absolute w-6 h-6 text-[#064E3B] animate-spin" />
      </div>
      
      <motion.p 
        key={message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-bold tracking-tight text-[#064E3B]"
      >
        {message}
      </motion.p>
    </div>
  )
}
