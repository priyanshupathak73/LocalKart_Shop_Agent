"use client";

import React from 'react';

export const FormInput = ({
  label,
  badge,
  badgeColor,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  maxLength,
  disabled = false,
  error,
  fontMono = false,
  uppercase = false,
  required = false,
  rightElement,
  className = ''
}) => {
  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-heading">
            {label} {required && '*'}
          </label>
          {badge && (
            <span className={`text-[10px] font-bold ${badgeColor || 'text-slate-400'}`}>
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
        )}

        <input
          type={type}
          disabled={disabled}
          value={value}
          maxLength={maxLength}
          onChange={(e) => {
            if (uppercase && e.target.value) {
              e.target.value = e.target.value.toUpperCase();
            }
            if (onChange) onChange(e);
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full bg-white dark:bg-slate-900 border rounded-xl py-3 text-xs outline-none dark:text-slate-100 font-semibold transition-all shadow-xs ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${rightElement ? 'pr-12' : ''} ${
            error
              ? 'border-red-500/90 focus:border-red-600 bg-red-50/10'
              : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500 dark:focus:border-emerald-500'
          } ${fontMono ? 'font-mono' : ''} ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800/40' : ''}`}
        />

        {rightElement && (
          <div className="absolute right-3 top-2.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] text-red-500 font-bold mt-1">{error}</p>
      )}
    </div>
  );
};
