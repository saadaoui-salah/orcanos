"use server";

async function addRow(data, objectData, user) {
  const response = await fetch(
    `https://app.orcanos.com/${user}/api/v2/Json/QW_Add_Object`,
    {
      method: "POST",
      body: JSON.stringify(objectData),
      headers: {
        "Content-Type": "application/json",
        Authorization: data.auth,
      },
    }
  );
  const result = await response.json();
  if (!response.ok) {
    return { status: 500, error: result };
  }
  return { status: 200, message: result };
}

async function processTable(table, data, user) {
  const objectData = {
    Project_ID: data.projectId,
    Major_Version: data.majorVersion,
    Minor_Version: data.minorVersion,
    Object_Type: data.objectType,
    Object_Name: data.objectType,
    Parent_ID: data.parentId,
  };
  for (const row of table) {
    objectData.CS1_Name = "HBLT ID";
    objectData.Object_Name = row.key;
    objectData.CS1_value = data.hbltId;
    objectData.CS2_Name = "HBLT File Name";
    objectData.CS2_value = row.fileName;
    objectData.CS3_Name = "Start Run Date";
    objectData.CS3_value = row.startDate;
    objectData.CS4_Name = "Start Run Time";
    objectData.CS4_value = row.startTime;
    objectData.CS5_Name = "End Run Time";
    objectData.CS5_value = row.endTime;
    objectData.CS6_Name = "Max Pressure";
    objectData.CS6_value = row.pressureMaxMeasurement;
    objectData.status = row.status;

    const results = await addRow(data, objectData, user);
    return results;
  }
}

// Call the function

export async function submitForm(formData) {
  // Convert FormData to JSON
  const data = Object.fromEntries(formData);
  const auth = `${data?.Username}:${data?.Password}`;
  const response = await fetch(
    "https://app.orcanos.com/orcanosdemo/api/v2/Json/QW_Login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${btoa(auth)}`, // Secure API key
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    return { success: true, apiResponse: result };
  }

  const result = await response.json();
  return { success: true, apiResponse: result };
}

export async function handleFiles(formData) {
  const files = formData.getAll("files");
  const data = Object.fromEntries(formData);
  const user = data.orcanosUrl.split("/")[3];
  const filesFormData = new FormData();
  filesFormData.set("file", files[0]);
  const r = await fetch(
    `https://app.orcanos.com/${user}/api/v2/Json/Add_Attachment?Object_ID=${data.parentId}&Object_Type=OBJECT`,
    {
      method: "POST",
      body: filesFormData,
      headers: {
        Authorization: data.auth,
      },
    }
  );
  const rdata = await r.json();
  if (rdata.HttpCode == 200) return { success: true };
  else return { success: false };
}

export async function handleResults(formData) {
  try {
    const data = Object.fromEntries(formData);
    const user = data.orcanosUrl.split("/")[3];

    const table = JSON.parse(data.table);
    await processTable(table, data, user);

    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: error.message };
  }
}
