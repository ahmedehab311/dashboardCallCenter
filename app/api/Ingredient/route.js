// app/api/flags.js
export async function GET() {
    const data = [
        { id: 1, name: "Peanuts" },
        { id: 2, name: "Gluten" },
        { id: 3, name: "Dairy" },
        { id: 4, name: "Soy" },
        { id: 5, name: "Eggs" },
        { id: 6, name: "Shellfish" },
      ];
   
    const response = {
      code: 200,
      responseStatus: true,
      messages: [],
      response: [
        {
          dataLength: data.length,
          pagination: null,
          data: data,
        },
      ],
    };
  
    return new Response(JSON.stringify(response), { status: 200 });
  }
  