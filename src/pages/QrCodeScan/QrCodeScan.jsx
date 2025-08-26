// src/components / QrCodeScan / QrCodeScan.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { qrCodeGenerator } from "../../_core/features/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

const QrCodeScan = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { qrCode, isGeneratingQrCode } = useSelector((state) => state.auth);

    useEffect(() => {
        if (location?.state) {
            dispatch(qrCodeGenerator({ email: location.state })); // Pass email from location state
        }
    }, [dispatch, location]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
            <div className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                    Secure Your Account
                </h2>
                <p className="mb-6 text-gray-600">
                    Enable <span className="font-medium">Two-Factor Authentication</span>{" "}
                    (2FA) to add an extra layer of security. Use{" "}
                    <span className="font-medium">Google Authenticator</span> app.
                </p>

                {isGeneratingQrCode ? (
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-gray-500">Generating QR Code...</p>
                    </div>
                ) : qrCode ? (
                    <>
                        <img
                            src={qrCode}
                            alt="QR Code"
                            className="w-56 h-56 p-2 mx-auto border rounded-lg shadow-md"
                        />
                        <div className="mt-6 text-left">
                            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                                <li>
                                    Open the <b>Google Authenticator</b> app.
                                </li>
                                <li>
                                    Tap <b>+</b> and select <b>Scan QR Code</b>.
                                </li>
                                <li>Scan the code above.</li>
                                <li>
                                    After scanning, continue forward and enter the generated code
                                    to complete login.
                                </li>
                            </ol>
                        </div>

                        {/* Continue Button */}
                        <div className="flex justify-center mt-8">
                            <Button
                                text="Continue to Login"
                                onClick={() =>
                                    navigate("/verification-login", { state: location?.state })
                                }
                                className="w-full"
                            />
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default QrCodeScan;