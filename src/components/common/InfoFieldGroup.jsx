import React from "react";
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const InfoFieldGroup = ({ fields = [] }) => {
  return (
    <Box>
      {fields.map(({ type = "text", label, value, options = [], disabled = false, onChange, name }, index) => {
        if (type === "select") {
          return (
            <FormControl
              key={index}
              fullWidth
              sx={{ mb: 2 }}
              variant="outlined"
            >
              <InputLabel sx={{ fontSize: "1.2rem" }}>{label}</InputLabel>
              <Select
                value={value}
                onChange={onChange}
                label={label}
                name={name}
                sx={{ fontSize: "1rem" }}
              >
                {options.map((option, idx) => (
                  <MenuItem key={idx} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }
        return (
          <TextField
            key={index}
            fullWidth
            label={label}
            value={value}
            disabled={disabled}
            onChange={onChange}
            name={name}
            type={type}
            sx={{
              mb: 2,
              "& .MuiInputBase-input": { fontSize: "1.1rem" },
              "& .MuiInputLabel-root": { fontSize: "1.2rem" },
            }}
          />
        );
      })}
    </Box>
  );
};

export default InfoFieldGroup;

