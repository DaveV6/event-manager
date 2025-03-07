import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = useState<string>(
    date ? format(date, "HH:mm") : ""
  )

  useQuery({
    queryKey: ["initialTime", date],
    queryFn: () => {
      if (date) {
        return format(date, "HH:mm");
      }
      return "";
    },
    enabled: !!date,
  });

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value)
    
    if (date && e.target.value) {
      const [hours, minutes] = e.target.value.split(":")
      const newDate = new Date(date)
      newDate.setHours(parseInt(hours, 10))
      newDate.setMinutes(parseInt(minutes, 10))
      setDate(newDate)
    }
  }

  const handleDateSelect = (selected: Date | undefined) => {
    if (selected) {
      const newDate = new Date(selected)
      
      if (date) {
        newDate.setHours(date.getHours())
        newDate.setMinutes(date.getMinutes())
      } else if (selectedTime) {
        const [hours, minutes] = selectedTime.split(":")
        newDate.setHours(parseInt(hours, 10))
        newDate.setMinutes(parseInt(minutes, 10))
      }
      
      setDate(newDate)
    } else {
      setDate(undefined)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal text-card-foreground",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <div className="relative flex items-center">
          <Clock className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="time"
            value={selectedTime}
            onChange={handleTimeChange}
            className="pl-10 block"
            disabled={!date}
          />
        </div>
      </div>
    </div>
  )
}
