using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace My_app.Pages
{
	[IgnoreAntiforgeryToken]
	public class IndexModel : PageModel
    {
        public void OnGet()
        {

        }
		private readonly string _filePath = "wwwroot/usersdata.json";

		// ? Ensure JSON file exists before processing
		private void EnsureFileExists()
		{
			if (!System.IO.File.Exists(_filePath))
			{
				System.IO.File.WriteAllText(_filePath, "[]"); // Initialize empty JSON file
			}
		}

		// ? Read existing users from JSON file
		private List<User> ReadUsers()
		{
			EnsureFileExists();
			string existingData = System.IO.File.ReadAllText(_filePath);

			return string.IsNullOrWhiteSpace(existingData)
				? new List<User>()
				: JsonSerializer.Deserialize<List<User>>(existingData) ?? new List<User>();
		}

		// ? Save users list back to JSON file
		private void SaveUsers(List<User> users)
		{
			string updatedJson = JsonSerializer.Serialize(users, new JsonSerializerOptions { WriteIndented = true });
			System.IO.File.WriteAllText(_filePath, updatedJson);
		}

		public JsonResult OnPostSaveData(User user)
		{
			List<User> users = ReadUsers();

			// Check for duplicate email
			if (users.Exists(u => u.Email == user.Email))
			{
				return new JsonResult(new { status = "Email already registered!" });
			}
			user.CreatedDate = DateTime.Now.ToString("dd-MM-yy HH:mm:ss");
			users.Add(user);
			SaveUsers(users);

			return new JsonResult(new { status = "User data saved successfully!" });
		}

		public JsonResult OnPostValidateUser(User user)
		{
			List<User> users = ReadUsers();

			// Check for duplicate email
			if (users.Exists(u => u.Email == user.Email))
			{
				return new JsonResult(new { status = "Valid User" });
			}
			return new JsonResult(new { status = "Invalid User" });
		}
	}
	public class User
	{
		public string Name { get; set; }
		public string Email { get; set; }
		public string Password { get; set; }
		public string Gender { get; set; }
		public string CreatedDate { get; set; }
	}
}
