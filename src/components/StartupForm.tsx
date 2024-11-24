/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { createStartupFormSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {
  // -----------------------------------------------------------------------------------------------
  // State: Keeps track of form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  // -----------------------------------------------------------------------------------------------
  // State: Keeps track of `pitch` form values
  const [pitch, setPitch] = useState("");
  // -----------------------------------------------------------------------------------------------
  // Used to display toast notifications
  const { toast } = useToast();
  // -----------------------------------------------------------------------------------------------
  // Used to navigate between pages
  const router = useRouter();
  // -----------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------
  // Form Action: Calls the `createPitch` Server Action on form submission
  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      // Construct an object from the form data
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      // Perform form validation using Zod
      await createStartupFormSchema.parseAsync(formValues);

      // Call the Server Action to create the startup
      const result = await createPitch(prevState, formData, pitch);

      // Handle the Server Action success response
      if (result.status == "SUCCESS") {
        // Display success toast
        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully",
        });

        // Navigate to the startup details page
        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      // If the error is a validation error from Zod, set the form errors state
      if (error instanceof z.ZodError) {
        // Get the field errors
        const fieldErrors = error.flatten().fieldErrors;
        // Set state
        setErrors(fieldErrors as unknown as Record<string, string>);
        // Display error toast
        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        // Return the new Form Action state
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      // Handle the Server Action error response
      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      // Return the new Form Action state
      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };
  // -----------------------------------------------------------------------------------------------
  // Form Action State: Keeps track of the form action state and calls the `handleFormSubmit` Form Action on submit
  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });
  // -----------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------
  return (
    // Startup Create Form
    <form action={formAction} className="startup-form">
      {/* Title */}
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />
        {/* Field Error */}
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>
      {/* Description */}
      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />
        {/* Field Error */}
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>
      {/* Category */}
      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Education...)"
        />
        {/* Field Error */}
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>
      {/* Image */}
      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />
        {/* Field Error */}
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      {/* Pitch (Markdown) */}
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>

        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {/* Field Error */}
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      {/* Submit Button (uses Form Action State to modify its behavior) */}
      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending} // Disable the button while the form is submitting
      >
        {/* Submit Button Text: If the form is submitting, show "Submitting..." */}
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
