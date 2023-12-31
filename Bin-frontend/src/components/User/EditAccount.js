import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  loadUser,
  register,
  updateProfile,
} from "../../redux/actions/userActions";
import { useAlert } from "react-alert";
import "./EditAccount.css";
function EditAccount({ location }) {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.user);
  const [user, setUser] = useState({
    name: "",
    password: "",
    phone: "",
    address: "",
  });

  const { name, email, password, phone, address } = user;
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const updateSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    if (password !== confirmPassword) {
      alert.error("Password Not Matching");
      return;
    }
    if (name !== "") myForm.set("name", name);
    if (password !== "") myForm.set("password", password);
    if (phone !== "") myForm.set("phone", phone);
    myForm.set("avatar", avatar);
    if (address !== "") myForm.set("address", address);

    dispatch(updateProfile(myForm));
    alert.success("USER UPDATED SUCCESSFULLY");
    dispatch(loadUser());
  };

  const editDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  // const redirect = "/account";

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <div className="form-style edit_box">
      <div class="bio-graph-heading ">Edit Account</div>
      <div class="panel-body bio-graph-info m-2 p-2">
        <form onSubmit={updateSubmit}>
          <div className="row m-2">
            <div className="col-md-6 desc_col">
              <div className="form-group pb-3">
                <input
                  type="text"
                  className=" form-control"
                  placeholder="Name"
                  name="name"
                  value={name}
                  onChange={editDataChange}
                />
              </div>
              <div className="form-group pb-3">
                <input
                  type="tel"
                  placeholder="Phone Number (01********)"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  value={phone}
                  onChange={editDataChange}
                  name="phone"
                />
              </div>
              <div className="form-group pb-3">
                <input
                  type="text"
                  className=" form-control"
                  placeholder="Address"
                  name="address"
                  value={address}
                  onChange={editDataChange}
                />
              </div>
              <div className="form-group pb-3">
                <input
                  type="password"
                  className=" form-control"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={editDataChange}
                />
              </div>
              <div className="form-group pb-3">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="form-control"
                  id="exampleInputPassword1"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 image_col">
              <div className="form-group pb-1 text-center">
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className=" text-center"
                  width={200}
                />
                <br />
                <label htmlFor="avatar" className="file-input-label">
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={editDataChange}
                  />
                  <div className="file-input-button">+</div>
                </label>
              </div>
            </div>

            <div className="p-2 text-center mt-4">
              <button type="submit" className="btn btn-success edit-button">
                Edit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAccount;
