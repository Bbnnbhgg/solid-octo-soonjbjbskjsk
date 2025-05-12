export default {
  async fetch(request) {
    const { searchParams, pathname } = new URL(request.url);

    if (pathname === "/generate") {
      const username = searchParams.get("username");
      if (!username) {
        return new Response(JSON.stringify({ error: "Username is required." }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      try {
        const apiResponse = await fetch("https://users.roblox.com/v1/usernames/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usernames: [username],
            excludeBannedUsers: false
          })
        });

        const data = await apiResponse.json();

        if (apiResponse.ok && data.data && data.data.length > 0) {
          const user = data.data[0];
          return new Response(JSON.stringify({
            profileUrl: `https://www.roblox.com/users/${user.id}/profile`,
            username: user.name,
            displayName: user.displayName
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else {
          return new Response(JSON.stringify({
            profileUrl: "User not found or invalid username."
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
      } catch (err) {
        return new Response(JSON.stringify({
          profileUrl: "Error occurred while fetching data."
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};
