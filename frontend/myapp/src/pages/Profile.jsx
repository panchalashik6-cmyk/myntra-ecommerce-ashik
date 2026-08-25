import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";


function Profile() {

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    username: "",
    phone: "",
    gender: "",
    city: "",
    bio: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);


  const loadProfile = async () => {

    try {

      const response = await API.get(
        "/user/profile"
      );

      const userData = response.data.user;

      setUser(userData);

      setForm({
        username: userData.username || "",
        phone: userData.phone || "",
        gender: userData.gender || "",
        city: userData.city || "",
        bio: userData.bio || ""
      });

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Profile load failed"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadProfile();
  }, []);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  };


  const saveProfile = async (e) => {

    e.preventDefault();

    try {

      const response = await API.put(
        "/user/profile",
        form
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);

      const oldUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...oldUser,
          ...updatedUser
        })
      );


      setMessage(
        "Profile updated successfully"
      );

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Update failed"
      );

    }
  };


  if (loading) {
    return (
      <div className="loader page-loader">
        Loading profile…
      </div>
    );
  }


  return (
    <div className="container profile-page">

      <div className="profile-hero">

        <div className="avatar">

          {(user?.username || "U")
            .charAt(0)
            .toUpperCase()}

        </div>


        <div>

          <span>
            MY ACCOUNT
          </span>

          <h1>
            {user?.username}
          </h1>

          <p>
            {user?.email}
          </p>

        </div>

      </div>


      <div className="row g-4">

        <div className="col-lg-8">

          <form
            className="profile-card"
            onSubmit={saveProfile}
          >

            <h3>
              Personal information
            </h3>


            <div className="form-grid">

              <label>
                Name

                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />

              </label>

              <label>
                Phone

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10 digit mobile number"
                />

              </label>

              <label>
                Gender

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >

                  <option value="">
                    Select
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </label>

              <label>
                City

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />

              </label>

            </div>

            <label>
              About you

              <textarea
                name="bio"
                rows="4"
                value={form.bio}
                onChange={handleChange}
              />

            </label>

            {message && (
              <div className="alert alert-success">
                {message}
              </div>
            )}

            <button className="primary-btn">
              SAVE CHANGES
            </button>

          </form>

        </div>

        <div className="col-lg-4">

          <div className="profile-links">

            <Link to="/orders">
              My Orders →
            </Link>

            <Link to="/wishlist">
              My Wishlist →
            </Link>

            <Link to="/cart">
              My Bag →
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Profile;