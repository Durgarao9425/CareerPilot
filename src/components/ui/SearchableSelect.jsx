import { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

export default function SearchableSelect({ label, value, onChange, options = [], placeholder }) {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((opt) =>
          opt.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  // Allow custom values by adding the query to the top of the filtered list if it doesn't exactly match
  const showCreateOption = query !== '' && !options.some((opt) => opt.toLowerCase() === query.toLowerCase());
  const optionsWithCustom = showCreateOption ? [query, ...filteredOptions] : filteredOptions;

  return (
    <div className="w-full relative z-20">
      {label && <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">{label}</label>}
      <Combobox value={value} onChange={onChange}>
        <div className="relative">
          <div className="relative w-full cursor-default text-left bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-xl focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all duration-200">
            <Combobox.Input
              className="w-full border-none py-2.5 pl-4 pr-10 text-sm leading-5 text-surface-900 dark:text-surface-100 bg-transparent focus:ring-0 placeholder-surface-400 outline-none rounded-xl"
              displayValue={(opt) => opt}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-surface-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-50">
              {optionsWithCustom.length === 0 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-surface-500">
                  Nothing found.
                </div>
              ) : (
                optionsWithCustom.map((opt, index) => {
                  const isCustom = showCreateOption && index === 0;
                  return (
                    <Combobox.Option
                      key={opt + index}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100' : 'text-surface-900 dark:text-surface-100'
                        }`
                      }
                      value={opt}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {isCustom ? `Use "${opt}"` : opt}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-primary-600 dark:text-primary-400' : 'text-primary-600 dark:text-primary-400'
                              }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  );
                })
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
