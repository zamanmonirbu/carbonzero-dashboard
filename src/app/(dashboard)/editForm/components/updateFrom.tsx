/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Define the organization types
const organizationTypes = [
  { id: "private-limited", label: "Private Limited Company (LTD)" },
  { id: "public-limited", label: "Public Limited Company (PLC)" },
  { id: "sole-proprietorship", label: "Sole Proprietorship" },
  { id: "partnership", label: "Partnership" },
  { id: "limited-liability", label: "Limited Liability Partnership (LLP)" },
  { id: "corporation", label: "Corporation" },
  { id: "cooperative", label: "Cooperative" },
  { id: "non-profit", label: "Non-Profit Organization (NPO)" },
  { id: "social-enterprise", label: "Social Enterprise" },
  { id: "state-owned", label: "State-Owner Enterprise (SOE)" },
  { id: "other", label: "Other..." },
];

const energySources = [
  { id: "coal", label: "Coal" },
  { id: "natural_gas", label: "Natural Gas" },
  { id: "oil", label: "Oil" },
  { id: "nuclear", label: "Nuclear" },
  { id: "solar", label: "Solar" },
  { id: "wind", label: "Wind" },
  { id: "hydro", label: "Hydro" },
  { id: "biomass", label: "Biomass" },
  { id: "geothermal", label: "Geothermal" },
  { id: "mixed_sources", label: "Mixed Sources" },
];

const fuelTypes = [
  { id: "petrol", value: "petrol", label: "Petrol/Gasoline" },
  { id: "diesel", value: "diesel", label: "Diesel" },
  { id: "electric", value: "electric", label: "Electric" },
  { id: "hybrid", value: "hybrid", label: "Hybrid" },
  { id: "cng", value: "cng", label: "Compressed Natural Gas (CNG)" },
  { id: "lpg", value: "lpg", label: "Liquefied Petroleum Gas (LPG)" },
  { id: "hydrogen", value: "hydrogen", label: "Hydrogen" },
  { id: "biofuel", value: "biofuel", label: "Biofuel" },
  { id: "mixed", value: "mixed", label: "Mixed Fuel Types" },
];

// Define the transportation methods
const transportationMethods = [
  { value: "road", label: "Road Transport" },
  { value: "rail", label: "Rail Transport" },
  { value: "sea", label: "Sea Transport" },
  { value: "air", label: "Air Transport" },
  { value: "pipeline", label: "Pipeline" },
  { value: "mixed", label: "Mixed Methods" },
];

// Removed unused businessSectors variable

// Define the object schema for sectors, energy sources, and fuel types
const selectionSchema = z.object({
  name: z.string(),
  percentage: z.string().optional(),
  isSelected: z.boolean(),
});

// Update the form schema for energy sources and fuel types
const formSchema = z.object({
  // Section 1: Personal/Company Information
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(5, { message: "Phone number is required" }),
  // totalCarbonEmmision: z.string({
  //   message: "Total carbon emmision is required",
  // }),
  companyLegalName: z
    .string()
    .min(2, { message: "Company legal name is required" }),
  companyOperatingName: z
    .string()
    .min(2, { message: "Company operating name is required" }),
  website: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  headquarterLocation: z
    .string()
    .min(2, { message: "Headquarter location is required" }),
  organizationType: z
    .string()
    .min(1, { message: "Please select an organization type" }),
  businessSector: z.array(selectionSchema).default([]).optional(),
  numberOfEmployees: z
    .string()
    .min(1, { message: "Number of employees is required" }),
  businessDescription: z
    .string()
    .max(400, { message: "Description must be 400 words or less" })
    .optional(),

  // Section 2: Carbon Footprint
  carbonFootprintDescription: z.string().optional(),
  electricalConsumption: z
    .string()
    .min(1, { message: "Electrical consumption is required" }),
  energySources: z.array(selectionSchema).default([]).optional(),
  renewablePercentage: z.string().optional(),
  companyVehicles: z
    .string()
    .min(1, { message: "Number of vehicles is required" }),
  fuelTypes: z.array(selectionSchema).default([]).optional(),
  averageDistance: z
    .string()
    .min(1, { message: "Average distance is required" }),
  flightDistance: z.string().min(1, { message: "Flight distance is required" }),
  trainDistance: z.string().min(1, { message: "Train distance is required" }),

  // Section 3: Supply Chain & Logistics
  supplyChainNumber: z
    .string()
    .min(1, { message: "Supply chain number is required" }),
  goodsVolume: z.string().min(1, { message: "Goods volume is required" }),
  transportationMethod: z
    .string()
    .min(1, { message: "Please select a transportation method" }),

  // Section 4: Finances
  financesDescription: z.string().optional(),
  annualTurnover: z.string().min(1, { message: "Annual turnover is required" }),
  assetsValue: z.string().min(1, { message: "Assets value is required" }),
  // Note: File upload would be handled separately
  financialStatements: z.any().optional(), // For file upload
});

const businessSectors = [
  { id: "manufacturing", label: "Manufacturing" },
  { id: "retail", label: "Retail" },
  { id: "technology", label: "Technology" },
  { id: "healthcare", label: "Healthcare" },
  { id: "finance", label: "Finance" },
  { id: "education", label: "Education" },
  { id: "transportation", label: "Transportation" },
  { id: "construction", label: "Construction" },
  { id: "agriculture", label: "Agriculture" },
  { id: "energy", label: "Energy" },
  { id: "other", label: "Other..." },
];

interface Props {
  initianData?: any;
}
export default function EmissionForm({ initianData }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;



  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    const lstoredToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    } else setToken(lstoredToken);
  }, []);

  // const {user} = useAuth()
  
  console.log(initianData)

  const { mutate, isPending } = useMutation({
    mutationKey: ["emmison-form-submit"],
    mutationFn: (formData: FormData) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emissions/${initianData.user_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }).then((res) => res.json()),
    onSuccess: (data) => {
      toast.success(data.message);
      console.log("submmited response", data);
    },
  });

  const { mutate: edit, isPending: isEditing } = useMutation({
    mutationKey: ["emmison-form-edit"],
    mutationFn: (formData: FormData) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emissions/${initianData.user_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }).then((res) => res.json()),
    onSuccess: (data) => {
      toast.success("Updated successfully");
      console.log("submmited response", data);
    },
  });

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initianData?.basic_information?.full_name ?? "",
      email: initianData?.basic_information?.email ?? "",
      phoneNumber: initianData?.basic_information?.phone_number ?? "",
      // totalCarbonEmmision:
      //   initianData?.basic_information?.total_carbon_emissions.toString() ?? "",
      companyLegalName:
        initianData?.basic_information?.company_legal_name ?? "",
      companyOperatingName:
        initianData?.basic_information?.company_operating_name ?? "",
      website: initianData?.basic_information?.website ?? "",
      headquarterLocation:
        initianData?.basic_information?.headquarter_location ?? "",
      organizationType: initianData?.basic_information?.type_of_organization,

      businessSector: initianData?.basic_information?.business_sector
        ? businessSectors.map((sector) => {
            const initialSector =
              initianData.basic_information.business_sector.find(
                (s: any) =>
                  s.sector.toLowerCase() === sector.label.toLowerCase(),
              );
            return {
              name: sector.id,
              percentage: initialSector
                ? initialSector.carbon_emission_percentage.toString()
                : "",
              isSelected: !!initialSector,
            };
          })
        : businessSectors.map((sector) => ({
            name: sector.id,
            percentage: "",
            isSelected: false,
          })),
      numberOfEmployees:
        initianData?.basic_information?.number_of_employees.toString() ?? "",
      businessDescription:
        initianData?.basic_information?.business_description ?? "",

      carbonFootprintDescription: initianData?.finances.description ?? "",
      electricalConsumption:
        initianData?.carbon_footprint?.total_electrical_consumption_kwh.toString() ??
        "",

      energySources: initianData?.carbon_footprint?.energy_sources
        ? energySources.map((source) => {
            const initialSource =
              initianData.carbon_footprint.energy_sources.find(
                (s: any) =>
                  s.source.toLowerCase() === source.label.toLowerCase(),
              );

            return {
              name: source.id,
              percentage: initialSource
                ? initialSource.usage_percentage.toString()
                : "",
              isSelected: !!initialSource,
            };
          })
        : energySources.map((source) => ({
            name: source.id,
            percentage: "",
            isSelected: false,
          })),

      renewablePercentage:
        initianData?.carbon_footprint?.percentage_of_energy_renewable.toString() ??
        "",
      companyVehicles:
        initianData?.carbon_footprint?.number_of_company_owned_vehicles.toString() ??
        "",

      fuelTypes: initianData?.carbon_footprint?.type_of_fuel_used_in_vehicles
        ? fuelTypes.map((type) => {
            const initialFuel =
              initianData.carbon_footprint.type_of_fuel_used_in_vehicles.find(
                (f: any) =>
                  f.fuel_type.toLowerCase() === type.label.toLowerCase(),
              );

            return {
              name: type.id,
              percentage: initialFuel
                ? initialFuel.usage_percentage.toString()
                : "",
              isSelected: !!initialFuel,
            };
          })
        : fuelTypes.map((type) => ({
            name: type.id,
            percentage: "",
            isSelected: false,
          })),

      averageDistance:
        initianData?.carbon_footprint?.average_distance_travelled_per_vehicle_annually.distance.toString() ??
        "",
      flightDistance:
        initianData?.carbon_footprint?.annual_business_flight_distance.distance.toString() ??
        "",
      trainDistance:
        initianData?.carbon_footprint?.annual_business_train_distance.distance.toString() ??
        "",
      supplyChainNumber: initianData?.supply_chain_logistics?.description ?? "",
      goodsVolume:
        initianData?.supply_chain_logistics?.volume_of_goods_transportation_tons.toString() ??
        "",
      transportationMethod:
        initianData?.supply_chain_logistics?.primary_transportation_method ??
        "",
      financesDescription: initianData?.finances?.description ?? "",
      annualTurnover:
        initianData?.finances?.total_annual_turnover.toString() ?? "",
      assetsValue:
        initianData?.finances?.total_value_of_assets.toString() ?? "",
      financialStatements: undefined,
    },
  });

  // const businessSetorsFilldData = form.watch("businessSector");

  useEffect(() => {
    // Watch the "businessSector", "fuelTypes", and "energySources" fields in the form
    const businessSetorsFilldData = form.watch("businessSector");
    const fuelTypesFilledData = form.watch("fuelTypes");
    const energySourcesFilledData = form.watch("energySources");

    const validateAndAdjustPercentages = (
      filledData: typeof businessSetorsFilldData,
      fieldName: "businessSector" | "fuelTypes" | "energySources",
    ) => {
      if (!filledData) return;

      // Calculate the total percentage of selected items (excluding "other")
      const totalPercentage = filledData.reduce((acc, item) => {
        if (item.isSelected && item.name !== "other") {
          return acc + Number(item.percentage || 0);
        }
        return acc;
      }, 0);

      // Check if the total percentage exceeds 100%
      if ((totalPercentage || 0) > 100) {
        // Set an error in the form for the respective field
        form.setError(fieldName, {
          type: "manual",
          message: "The total percentage cannot exceed 100%.",
        });
        toast.warning("The total percentage cannot exceed 100%.");
      } else {
        // Clear the error if the total percentage is valid
        form.clearErrors(fieldName);
        // Find the "other" object
        const otherItem = filledData.find((item) => item.name === "other");

        // If totalPercentage is less than 100, assign the rest to the "other" object
        if (totalPercentage < 100 && otherItem) {
          const remainingPercentage = 100 - totalPercentage;

          // Update the "other" object's percentage only if it differs
          if (otherItem.percentage !== remainingPercentage.toString()) {
            form.setValue(
              fieldName,
              filledData.map((item) =>
                item.name === "other"
                  ? { ...item, percentage: remainingPercentage.toString() }
                  : item,
              ),
              { shouldValidate: false }, // Prevent re-triggering validation
            );
          }
        } else if (otherItem) {
          // Reset the "other" object's percentage to 0 if totalPercentage is exactly 100
          if (otherItem.percentage !== "0") {
            form.setValue(
              fieldName,
              filledData.map((item) =>
                item.name === "other" ? { ...item, percentage: "0" } : item,
              ),
              { shouldValidate: false }, // Prevent re-triggering validation
            );
          }
        }
      }

      // Update the state to disable the "Next" button if total percentage exceeds 100%
      setIsNextDisabled(totalPercentage > 100);
    };

    // Validate and adjust percentages for each section
    validateAndAdjustPercentages(businessSetorsFilldData, "businessSector");
    validateAndAdjustPercentages(fuelTypesFilledData, "fuelTypes");
    validateAndAdjustPercentages(energySourcesFilledData, "energySources");
  }, [
    form.watch("businessSector"),
    form.watch("fuelTypes"),
    form.watch("energySources"),
  ]); // Dependency array ensures this runs when any of these fields change

  // State to manage the "Next" button's disabled state
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  // Input validation for percentage fields
  const validatePercentageInput = (value: string) => {
    const percentage = Number(value);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return "Percentage must be a number between 0 and 100.";
    }
    return true;
  };

  // Updated "Next" button logic
  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep) as Array<
      keyof z.infer<typeof formSchema>
    >;
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid && !isNextDisabled) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    const formData = new FormData();

    // Basic Information (Step 1)
    formData.append("basic_information.full_name", values.fullName);
    formData.append("basic_information.email", values.email);
    formData.append("basic_information.phone_number", values.phoneNumber);
    // formData.append(
    //   "basic_information.total_carbon_emissions",
    //   Number(values.totalCarbonEmmision).toString(),
    // );
    formData.append(
      "basic_information.company_legal_name",
      values.companyLegalName,
    );
    formData.append(
      "basic_information.company_operating_name",
      values.companyOperatingName,
    );
    {
      values.website &&
        formData.append("basic_information.website", values.website);
    }
    formData.append(
      "basic_information.headquarter_location",
      values.headquarterLocation,
    );
    formData.append(
      "basic_information.type_of_organization",
      values.organizationType,
    );

    // Business Sectors
    let sectorIndex = 0;
    values.businessSector?.forEach((sector) => {
      if (sector.isSelected) {
        formData.append(
          `basic_information.business_sector[${sectorIndex}].sector`,
          businessSectors.find((s) => s.id === sector.name)?.label ||
            sector.name,
        );
        formData.append(
          `basic_information.business_sector[${sectorIndex}].carbon_emission_percentage`,
          sector.percentage || "0",
        );
        sectorIndex++;
      }
    });
    formData.append(
      "basic_information.number_of_employees",
      values.numberOfEmployees,
    );
    formData.append(
      "basic_information.business_description",
      values.businessDescription || "",
    );

    // Carbon Footprint (Step 2)
    formData.append(
      "carbon_footprint.total_electrical_consumption_kwh",
      Number(values.electricalConsumption).toString(),
    );

    // Energy Sources
    let energyIndex = 0;
    values.energySources?.forEach((source) => {
      if (source.isSelected) {
        formData.append(
          `carbon_footprint.energy_sources[${energyIndex}].source`,
          energySources.find((s) => s.id === source.name)?.label || source.name,
        );
        formData.append(
          `carbon_footprint.energy_sources[${energyIndex}].usage_percentage`,
          source.percentage || "0",
        );
        energyIndex++;
      }
    });
    formData.append(
      "carbon_footprint.percentage_of_energy_renewable",
      Number(values.renewablePercentage).toString(),
    );
    formData.append(
      "carbon_footprint.number_of_company_owned_vehicles",
      Number(values.companyVehicles).toString(),
    );

    // Fuel Types
    let fuelIndex = 0;
    values.fuelTypes?.forEach((fuel) => {
      if (fuel.isSelected) {
        formData.append(
          `carbon_footprint.type_of_fuel_used_in_vehicles[${fuelIndex}].fuel_type`,
          fuelTypes.find((f) => f.id === fuel.name)?.label || fuel.name,
        );
        formData.append(
          `carbon_footprint.type_of_fuel_used_in_vehicles[${fuelIndex}].usage_percentage`,
          fuel.percentage || "0",
        );
        fuelIndex++;
      }
    });

    // Distances
    formData.append(
      "carbon_footprint.average_distance_travelled_per_vehicle_annually.distance",
      Number(values.averageDistance).toString(),
    );
    formData.append(
      "carbon_footprint.annual_business_flight_distance.distance",
      Number(values.flightDistance).toString(),
    );
    formData.append(
      "carbon_footprint.annual_business_train_distance.distance",
      Number(values.trainDistance).toString(),
    );

    // Supply Chain & Logistics (Step 3)
    formData.append(
      "supply_chain_logistics.volume_of_goods_transportation_tons",
      values.goodsVolume,
    );

    formData.append(
      "supply_chain_logistics.description",
      values.supplyChainNumber,
    );
    formData.append(
      "supply_chain_logistics.primary_transportation_method",
      values.transportationMethod,
    );

    // Finances (Step 4)
    formData.append(
      "finances.description",
      values.carbonFootprintDescription || "",
    );
    formData.append("finances.total_annual_turnover", values.annualTurnover);
    formData.append("finances.total_value_of_assets", values.assetsValue);
    if (values.financialStatements) {
      formData.append(
        "financial_statements",
        values.financialStatements as File,
      );
    }

    if (initianData) {
      edit(formData);
    } else {
      mutate(formData);
    }
  }

  // Navigate to the previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Get fields that need to be validated for the current step
  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return [
          "fullName",
          "email",
          "phoneNumber",
          "companyLegalName",
          "companyOperatingName",
          "website",
          "headquarterLocation",
          "organizationType",
          "businessSector",
          "numberOfEmployees",
          "businessDescription",
        ];
      case 2:
        return [
          "electricalConsumption",
          "energySource",
          "companyVehicles",
          "fuelType",
          "averageDistance",
          "flightDistance",
          "trainDistance",
        ];
      case 3:
        return ["supplyChainNumber", "goodsVolume", "transportationMethod"];
      case 4:
        return ["annualTurnover", "assetsValue"];
      default:
        return [];
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Emission Form</h1>
        <p className="text-sm text-gray-600">
          This is a required form to help us track your emissions and give you
          personalized advice.
        </p>
      </div>

      <div className="mb-6 flex w-full items-center justify-between bg-primary">
        <h2 className="rounded-t-md bg-primary px-4 py-2 text-lg font-semibold text-white">
          Section {currentStep} of {totalSteps}
        </h2>
        {/* <Link href={"/account/emission-form/edit"}>
          {" "}
          <button className="mr-10 px-5 text-white">Edit</button>
        </Link> */}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Section 1: Personal/Company Information */}
              <div className={cn(currentStep === 1 ? "block" : "hidden")}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter your name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyLegalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Legal Name</FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter company legal name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyOperatingName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Operating Name</FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter company operating name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="URL"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="totalCarbonEmmision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Cardon Emmision</FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter carbon emmision"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <FormField
                    control={form.control}
                    name="headquarterLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Headquarter Location</FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter headquarter location"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Organization</FormLabel>
                        <div className="grid grid-cols-1 space-y-3 md:grid-cols-4">
                          {organizationTypes.map((type) => (
                            <div
                              key={type.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={type.id}
                                checked={field.value === type.id}
                                onCheckedChange={() => {
                                  form.setValue("organizationType", type.id);
                                }}
                              />
                              <label
                                htmlFor={type.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {type.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessSector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Sector</FormLabel>
                        <div className="space-y-4">
                          {businessSectors.map((sector, index) => (
                            <div
                              key={sector.id}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`sector-${sector.id}`}
                                  checked={
                                    (field.value ?? [])[index]?.isSelected ||
                                    false
                                  }
                                  onCheckedChange={(checked) => {
                                    const newValue = [...(field.value || [])];
                                    newValue[index] = {
                                      ...newValue[index],
                                      isSelected: !!checked,
                                    };
                                    field.onChange(newValue);
                                  }}
                                />
                                <label
                                  htmlFor={`sector-${sector.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {sector.label}
                                </label>
                              </div>
                              {(field.value ?? [])[index]?.isSelected && (
                                <Input
                                  className="ml-6 w-[calc(100%-1.5rem)] py-6"
                                  placeholder="Enter Percentage"
                                  value={
                                    (field.value ?? [])[index]?.percentage || ""
                                  }
                                  onChange={(e) => {
                                    const newValue = [...(field.value || [])];
                                    const validationMessage =
                                      validatePercentageInput(e.target.value);
                                    if (validationMessage === true) {
                                      newValue[index] = {
                                        ...newValue[index],
                                        percentage: e.target.value,
                                      };
                                      field.onChange(newValue);
                                    } else {
                                      toast.error(validationMessage);
                                    }
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numberOfEmployees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter number of employees"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Business Description (Max 400 Words)
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Write here..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 2: Carbon Footprint */}
              <div className={cn(currentStep === 2 ? "block" : "hidden")}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="carbonFootprintDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="electricalConsumption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Total electrical consumption (kWh) annually
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter total"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="energySources"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Energy sources</FormLabel>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                          {energySources.map((source, index) => (
                            <div
                              key={source.id}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`energy-${source.id}`}
                                  checked={
                                    (field.value ?? [])[index]?.isSelected ||
                                    false
                                  }
                                  onCheckedChange={(checked) => {
                                    const newValue = [...(field.value || [])];
                                    newValue[index] = {
                                      ...newValue[index],
                                      isSelected: !!checked,
                                    };
                                    field.onChange(newValue);
                                  }}
                                />
                                <label
                                  htmlFor={`energy-${source.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {source.label}
                                </label>
                              </div>
                              {field.value?.[index]?.isSelected && (
                                <Input
                                  className="ml-6 w-[calc(100%-1.5rem)] py-6"
                                  placeholder="Enter Percentage"
                                  value={
                                    (field.value ?? [])[index]?.percentage || ""
                                  }
                                  onChange={(e) => {
                                    const newValue = [...(field.value || [])];
                                    newValue[index] = {
                                      ...newValue[index],
                                      percentage: e.target.value,
                                    };
                                    field.onChange(newValue);
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="renewablePercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Percentage of Energy Renewable (If Applicable)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Percentage"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyVehicles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Company Owned Vehicles</FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fuelTypes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Fuel used in Vehicles</FormLabel>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                          {fuelTypes.map((type, index) => (
                            <div
                              key={type.id}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`fuel-${type.id}`}
                                  checked={
                                    (field.value ?? [])[index]?.isSelected ||
                                    false
                                  }
                                  onCheckedChange={(checked) => {
                                    const newValue = [...(field.value || [])];
                                    newValue[index] = {
                                      ...newValue[index],
                                      isSelected: !!checked,
                                    };
                                    field.onChange(newValue);
                                  }}
                                />
                                <label
                                  htmlFor={`fuel-${type.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {type.label}
                                </label>
                              </div>
                              {(field.value ?? [])[index]?.isSelected && (
                                <Input
                                  className="ml-6 w-[calc(100%-1.5rem)] py-6"
                                  placeholder="Enter Percentage"
                                  value={
                                    (field.value ?? [])[index]?.percentage || ""
                                  }
                                  onChange={(e) => {
                                    const newValue = [...(field.value || [])];
                                    const validationMessage =
                                      validatePercentageInput(e.target.value);
                                    if (validationMessage === true) {
                                      newValue[index] = {
                                        ...newValue[index],
                                        percentage: e.target.value,
                                      };
                                      field.onChange(newValue);
                                    } else {
                                      toast.error(validationMessage);
                                    }
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="averageDistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Average Distance Travelled Per Vehicle Annually
                        </FormLabel>
                        <FormDescription>
                          Specify whether you are using miles or kilometers in
                          your answer
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Enter Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="flightDistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Business Flight Distance</FormLabel>
                        <FormDescription>
                          Specify whether you are using miles or kilometers in
                          your answer
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Enter Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trainDistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Business Train Distance</FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 3: Supply Chain & Logistics */}
              <div className={cn(currentStep === 3 ? "block" : "hidden")}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="supplyChainNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shortly describe the transport and delivery methods used in your supply chain</FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goodsVolume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Volume of Goods Transportation Method (Tons)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Enter Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transportationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Transportation Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {transportationMethods.map((method) => (
                              <SelectItem
                                key={method.value}
                                value={method.value}
                              >
                                {method.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 4: Finances */}
              <div className={cn(currentStep === 4 ? "block" : "hidden")}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="financesDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="annualTurnover"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Total Annual Turnover in the Last Financial Year
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Total amount"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assetsValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Total Value of Assets at End of the Last Financial
                          Year
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="py-6"
                            placeholder="Total value"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="financialStatements"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Financial Statements</FormLabel>
                        <FormDescription>
                          Income Statement, Balance Sheet, Cash Flow Statement
                        </FormDescription>
                        <div className="mt-2">
                          <Input
                            type="file"
                            className="py-2"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file || undefined);
                            }}
                            {...fieldProps}
                          />
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {value ? (value as File).name : "No file selected"}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={isNextDisabled}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isPending || isEditing}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
