import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React, { FormEventHandler, MouseEventHandler } from 'react'

interface Params {
  first: string;
  salary: number;
  setSalary: Function;
  selectedOption: string | null;
  handleRadioChange: Function;
  handleCloseSalaryPopup: MouseEventHandler;
  handleFormSubmit: FormEventHandler;
  selectedLocation: string | null;
  locations: { id: string; name: string }[];
  handleLocationHange: Function;
}

const VerifiedAccountForm = ({
  first,
  handleFormSubmit,
  salary,
  setSalary,
  selectedOption,
  handleRadioChange,
  handleCloseSalaryPopup,
  selectedLocation,
  locations,
  handleLocationHange
}: Params) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[400px] max-w-[90vw]">
        <CardHeader>
          <CardTitle>Verification</CardTitle>
          <p className="text-red-400 text-sm">
            WARNING, {first} will have access to the portal
          </p>
        </CardHeader>

        <form onSubmit={handleFormSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="number"
                placeholder="Enter salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <RadioGroup
                value={selectedOption || ""}
                onValueChange={(value) => handleRadioChange(value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Instructor" id="instructor" />
                  <Label htmlFor="instructor" className="font-normal">
                    Instructor
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Director" id="director" />
                  <Label htmlFor="director" className="font-normal">
                    Director
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Unverify" id="unverify" />
                  <Label htmlFor="unverify" className="font-normal">
                    Unverify
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <RadioGroup
                value={selectedLocation || ""}
                onValueChange={(value) => handleLocationHange(value)}
                className="flex flex-col space-y-1"
              >
                {locations.map((location) => (
                  <div key={location.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={location.id} id={location.id} />
                    <Label htmlFor={location.id} className="font-normal">
                      {location.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseSalaryPopup}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default VerifiedAccountForm