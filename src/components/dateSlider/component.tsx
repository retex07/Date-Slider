import React, { useEffect, useRef, useState } from "react";
import { LinePickerType, TooltipInfoType } from "./types";
import { Picker } from "../../static/icons/picker";
import { useDate } from "./hooks";
import "./style.scss";

interface Props {
    minDate: Date;
    maxDate: Date;
    selectedStartDate: Date;
    selectedEndDate: Date;
}

export default function DateSlider(props: Props) {
    const { getMonthName, getFullMonthName } = useDate();
    const { minDate, maxDate, selectedStartDate, selectedEndDate } = props;

    const [leftPicker, setLeftPicker] = useState(0);
    const [rightPicker, setRightPicker] = useState(0);
    const [isDateTypeMonths, setIsDateTypeMonths] = useState(false);
    const [pickerType, setPickerType] = useState<LinePickerType>(undefined);

    const [leftTooltipInfo, setLeftTooltipInfo] = useState<TooltipInfoType>({
        month: selectedStartDate.getMonth(),
        year: selectedStartDate.getFullYear(),
    });
    const [rightTooltipInfo, setRightTooltipInfo] = useState<TooltipInfoType>({
        month: selectedEndDate.getMonth(),
        year: selectedEndDate.getFullYear(),
    });

    const sliderRef = useRef<HTMLDivElement>(null);
    const leftHandleRef = useRef<HTMLDivElement>(null);
    const rightHandleRef = useRef<HTMLDivElement>(null);
    const leftTooltipRef = useRef<HTMLDivElement>(null);
    const rightTooltipRef = useRef<HTMLDivElement>(null);
    
    const countTimeZone = (maxDate.getFullYear() - minDate.getFullYear() + 1) * 12 + 1;
    const countYears = maxDate.getFullYear() - minDate.getFullYear() + 2;

    useEffect(() => {
        if (sliderRef.current) {
            const sizeSlider = sliderRef.current.getBoundingClientRect().width;
            const sizeOneZone = sizeSlider / countTimeZone;
            const margin = sizeOneZone / 5;

            [...Array(countTimeZone)].forEach((item: undefined, index: number) => {
                if (index === selectedStartDate.getMonth()
                    && minDate.getFullYear() === selectedStartDate.getFullYear()
                ) {
                    setLeftPicker(index * sizeOneZone + margin);
                } else if (index >= 12 && index % 12 === selectedStartDate.getMonth()
                    && minDate.getFullYear() + Math.floor(index / 12) === selectedStartDate.getFullYear()
                ) {
                    setLeftPicker(index * sizeOneZone + margin);
                }
            });

            [...Array(countTimeZone)].forEach((item: undefined, index: number) => {
                if (index === selectedEndDate.getMonth()
                    && minDate.getFullYear() === selectedEndDate.getFullYear()
                ) {
                    setRightPicker(sizeSlider - index * sizeOneZone - margin * 4);
                } else if (index >= 12 && index % 12 === selectedEndDate.getMonth()
                    && minDate.getFullYear() + Math.floor(index / 12) === selectedEndDate.getFullYear()
                ) {
                    setRightPicker(sizeSlider - index * sizeOneZone - margin * 4);
                }
            });
        }
    }, [selectedStartDate, countTimeZone, minDate, selectedEndDate]);

    function DateTypeSwitcher() {
        return (
            <div className="date-type-switcher">
                <p
                    className={`date-type-switcher--selected-${!isDateTypeMonths}`}
                    onClick={() => setIsDateTypeMonths(false)}
                >
                    Все года
                </p>
                <p
                    className={`date-type-switcher--selected-${isDateTypeMonths}`}
                    onClick={() => setIsDateTypeMonths(true)}
                >
                    Месяца
                </p>
            </div>
        );
    }

    function DateList() {
        return isDateTypeMonths ? (
                <>{[...Array(countTimeZone)].map((item, index) => (
                    (index === 0 || index % 12 === 0) ?
                        (
                            <span key={index} className="slider--black-text">
                                {minDate.getFullYear() + index / 12}
                            </span>
                        ) : (
                            <span key={index} className="slider--secondary-text">
                                {getMonthName(index % 12)}
                            </span>
                        )
                ))}</>
            ) : (
                <>{[...Array(countYears)].map((item, index) => (
                    <span key={index} className="slider--secondary-text">
                        {minDate.getFullYear() + index}
                    </span>
                ))}</>
            );
    }

    function handleMouseMove(event: React.MouseEvent) {
        if (sliderRef.current && leftHandleRef.current
            && rightHandleRef.current && pickerType
        ) {
            const sliderRect = sliderRef.current.getBoundingClientRect();
            const leftHandleRect = leftHandleRef.current.getBoundingClientRect();
            const rightHandleRect = rightHandleRef.current.getBoundingClientRect();

            const newLeftPickerPosition = event.clientX - sliderRect.left - 10;
            const newRightPickerPosition = sliderRect.right - event.clientX - 10;

            if (leftTooltipRef.current) {
                const leftTooltipRect = leftTooltipRef.current.getBoundingClientRect();

                const sizeOneZone = sliderRect.width / countTimeZone;
                const placeLeftPicker = leftTooltipRect.x - sliderRect.left;
                const indexPlace = Math.floor(placeLeftPicker / sizeOneZone) + 1;

                if (indexPlace < 12) {
                    setLeftTooltipInfo({
                        month: indexPlace,
                        year: minDate.getFullYear(),
                    });
                } else {
                    setLeftTooltipInfo({
                        month: indexPlace % 12,
                        year: minDate.getFullYear() + Math.floor(indexPlace / 12),
                    });
                }
            }

            if (rightTooltipRef.current) {
                const rightTooltipRect = rightTooltipRef.current.getBoundingClientRect();

                const sizeOneZone = sliderRect.width / countTimeZone;
                const placeLeftPicker = rightTooltipRect.x - sliderRect.left;
                const indexPlace = Math.floor(placeLeftPicker / sizeOneZone) + 1;

                if (indexPlace < 12) {
                    setRightTooltipInfo({
                        month: indexPlace,
                        year: minDate.getFullYear(),
                    });
                } else {
                    setRightTooltipInfo({
                        month: indexPlace % 12,
                        year: minDate.getFullYear() + Math.floor(indexPlace / 12),
                    });
                }
            }

            if (pickerType === "left" &&
                (leftHandleRect.x >= sliderRect.left || newLeftPickerPosition > leftPicker) &&
                (leftHandleRect.x < rightHandleRect.x - rightHandleRect.width - 1 || newLeftPickerPosition < leftPicker)
            ) {
                setLeftPicker(newLeftPickerPosition);
            } else if (pickerType === "right" &&
                (rightHandleRect.x <= sliderRect.right - rightHandleRect.width || newRightPickerPosition > rightPicker)
            ) {
                setRightPicker(newRightPickerPosition);
            }
        }
    }

    return (
        <div className="slider">
            <DateTypeSwitcher />
            <div className="slider--container">
                <section
                    onMouseUp={() => setPickerType(undefined)}
                    onMouseMove={handleMouseMove}
                    ref={sliderRef} className="slider--date-line-section"
                >
                    <div
                        ref={leftHandleRef}
                        onMouseDown={() => setPickerType("left")}
                        onMouseUp={() => setPickerType(undefined)}
                        className="slider--handle-pickers--left"
                        style={{ marginLeft: `${leftPicker}px` }}
                    >
                        {pickerType === "left" && (
                            <div className="tooltip tooltip--left" ref={leftTooltipRef}>
                                <p className="tooltip--text-time">{getFullMonthName(leftTooltipInfo.month)}</p>
                                <p className="tooltip--text-time">{leftTooltipInfo.year}</p>
                            </div>
                        )}
                        <Picker />
                    </div>
                    <div className="slider--line-between-picks" />
                    <div
                        ref={rightHandleRef}
                        onMouseDown={() => setPickerType("right")}
                        onMouseUp={() => setPickerType(undefined)}
                        className="slider--handle-pickers--right"
                        style={{ marginRight: `${rightPicker}px` }}
                    >
                        <Picker />
                        {pickerType === "right" && (
                            <div className="tooltip tooltip--right" ref={rightTooltipRef}>
                                <p className="tooltip--text-time">{getFullMonthName(rightTooltipInfo.month)}</p>
                                <p className="tooltip--text-time">{rightTooltipInfo.year}</p>
                            </div>
                        )}
                    </div>
                </section>
                <section className="slider--time-section">
                    <DateList />
                </section>
            </div>
        </div>
    );
}
