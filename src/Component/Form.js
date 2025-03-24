/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./Form.css";
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Input,
  Checkbox,
  Select,
  Form,
  Spin,
  Divider,
  List,
  Modal,
  Tag,
  Space,
  Tabs,
  Grid,
  ConfigProvider,
  Steps,
  notification,
  Avatar,
  Flex,
} from "antd";
import { PhoneOutlined, GlobalOutlined, MailOutlined, LeftOutlined, RightOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Carousel } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import countryList from "../countryList.json";
import langList from "../lang.json";
import logo from "../images/logo.png";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { VscAccount } from "react-icons/vsc";
import { IoLocationOutline, IoHomeOutline } from "react-icons/io5";
import { MdKey } from "react-icons/md";
import { SnackbarProvider, useSnackbar } from "notistack";
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;
import { useTheme } from "@emotion/react";

const ITEM_HEIGHT = 36;
const MOBILE_ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MENU_ITEMS = 6;
const TAB_ITEMS = ["home", "data", "setting", "help"];

const font = "'Poppins', sans-serif";

const FormComponent = () => {
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();
  const [api, contextHolder] = notification.useNotification();

  const [rData, setRData] = useState({});
  const [theme, setTheme] = useState({
    token: {
      colorPrimary: "#0855a4",
      fontFamily: font,
    },
  });
  const themeslider = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [setting, setSetting] = useState(null);
  const [licenseDetails, setLicenseDetails] = useState(null);
  const [isLicenseValid, setIsLicenseValid] = useState(false);
  const [licenseMessage, setLicenseMessage] = useState("");
  const [scrapData, setScrapData] = useState({});
  const [selectedKeywordId, setSelectedKeywordId] = useState("select");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91");
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("");
  const [key, setKey] = useState("");
  const [keyIsValid, setKeyIsValid] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState("home");
  const [delay, setDelay] = useState(1);
  const [selectLang, setSelectLang] = useState("en");
  const [dataFormate, setDataFormate] = useState("csv");
  const [network, setNetwork] = useState("facebook");
  const [countryCode, setCountryCode] = useState("India");
  const [columns, setColumns] = useState([]);
  const [extractCol, setExtractCol] = useState({});
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [licenceKeyErrorMessage, setLicenceKeyErrorMessage] = useState(t("invalidLicenseKey"));
  const [renewKey, setRenewKey] = useState("");
  const [renewOpen, setRenewOpen] = useState(false);
  const [localmanifestVersion, setLocalmanifestVersion] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const renewOpenForm = () => {
    setRenewKey("");
    setRenewOpen(true);
  };
  const renewCloseForm = () => {
    setRenewOpen(false);
  };

  //check email regex

  const isEmailIsValid = (emailAddress) => {
    // var reEmail =
    //   /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
    // if (!reEmail.match(email)) {
    //   return false;
    // } else {
    //   return true;
    // }

    //let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    return regex.test(emailAddress);

    //const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //return regexPattern.test(email);
  };

  const sendChromeMessage = (data, callback) => {
    try {
      chrome.runtime.sendMessage(data, (response) => {
        callback(response);
      });
    } catch (e) {
      console.log("sendMessage Error:", e);
      callback({
        status: false,
        message: "Something is wrong",
      });
    }
  };

  const getProductData = () => {
    sendChromeMessage({ type: "get_product" }, (response) => {
      console.log("getProduct", response)

      if (response.status) {
        //setIsLoading(false);
        setProduct(response.product);
      }
    });
  };

  const getColumns = () => {
    sendChromeMessage({ type: "columns" }, (response) => {
      if (!response || !response.columns) {
        console.error("Error: response or response.columns is undefined", response);
        return;
      }

      setColumns(response.columns);

      response.columns.forEach((x) => {
        setExtractCol((col) => {
          return { ...col, [x.value]: true };
        });
      });
    });
  };


  const getResellerData = () => {
    sendChromeMessage({ type: "get_data" }, (response) => {
      console.log("_data", response)
      if (response.status == true) {
        setRData(response.data);
        setPhone("+" + response.data.country_code);

        const c = countryList.find(
          (c) => c.countryCode == (response.data.country ?? "IN")
        );
        if (c) {
          setCountry(c.countryNameEn);
          setCountryCode(c.countryNameEn);
        } else {
          console.log("Country name not found");
        }
      }
    });
  };

  const getScrapeData = () => {
    sendChromeMessage({ type: "get_scrap" }, (response) => {

      if (response.status == true) {
        const data = response.data;
        setScrapData(data);
      } else {
        setScrapData({});
      }
    });
  };

  const getSetting = () => {
    sendChromeMessage({ type: "get_setting" }, (response) => {

      if (response.status == true) {
        const data = response.setting;
        setSetting(data);
        setDataFormate(data.exportForm);
        setDelay(data.delay);
        setExtractCol(data.extractCol);
        setSelectLang(data.lang ?? "en");
        i18next.changeLanguage(data.lang ?? "en");

      } else {
        // enqueueSnackbar(t(response.message));
      }
    });
  };

  const expireDate = () => {
    if (licenseDetails) {
      //return licenseDetails.expireAt;
      //let expDate = new Date(licenseDetails.expireAt);
      return dateFormat(licenseDetails.expireAt);
    } else {
      return "";
    }
  };

  const dateFormat = (dateString, showTime) => {
    let expDate = new Date(dateString);
    let optionsDate = { year: "numeric", month: "long", day: "numeric" };
    //return expDate.toLocaleDateString("en-in", optionsDate)+(showTime? " "+expDate.toLocaleTimeString("en-in"):"");
    const year = expDate.getUTCFullYear();
    const month = expDate.getUTCMonth() + 1; // Months are zero-indexed, so we add 1
    const day = expDate.getUTCDate();
    return `${day}-${month}-${year}`;
  };

  const renewLicenseKey = () => {
    sendChromeMessage(
      { key: licenseDetails.key, renew_key: renewKey, type: "renew" },
      (response) => {
        if (response.status == true) {
          enqueueSnackbar(response.message, { variant: "success" });
          setTimeout(() => {
            renewCloseForm();
          }, 500);
        } else {
          enqueueSnackbar(t(response.message), { variant: "error" });
        }
      }
    );
  };

  const getLicenseDetails = () => {
    sendChromeMessage({ type: "get_details" }, (response) => {
      console.log("get_Details", response)
      if (response.status == true) {
        setIsLicenseValid(true);
        setLicenseMessage("");
      } else {
        setIsLicenseValid(false);
        setLicenseDetails(null);
        setLicenseMessage(response.message);
      }

      if (response.detail) {
        setLicenseDetails(response.detail);
        //fill the form details
        setName(response.detail.name ?? "");
        setEmail(response.detail.email ?? "");
        setPhone(response.detail.phone ?? "");
        setCity(response.detail.place ?? "");
        setCountry(response.detail.country ?? "");
        setKey(response.detail.key ?? "");
      }

      setIsLoading(false);
    });
  };

  useEffect(() => {
    getResellerData();
    getColumns();
    getSetting();
    getProductData();
    getLicenseDetails();
    getVersion();
    getScrapeData();
  }, []);

  useEffect(() => {
    var color = "#0855a4";

    if (product) {
      color = product.color;
    }

    if (rData.theme_setting) {
      if (rData.theme_setting["primary-color"]) {
        color = rData.theme_setting["primary-color"];
      }
    }

    setTheme({
      token: {
        colorPrimary: color,
        fontFamily: font,
      },
    });
  }, [product, rData]);

  useEffect(() => {
    if (showValidation) {
      setTimeout(() => setShowValidation(false), 2000);
    }
  }, [showValidation]);

  // useEffect(() => {

  //   if(licenseDetails){
  //    if(!licenseDetails.enable || status ){

  //    }
  //   }

  //  }, [licenseDetails]);

  useEffect(() => {
    checkLicense(key);
  }, [key]);

  function checkLicense(key) {
    if (key.length == 19) {
      sendChromeMessage(
        { license_key: key, type: "license_verify" },
        (response) => {
          setKeyIsValid(response.status);
          setLicenceKeyErrorMessage(response.message);
        }
      );
    } else {
      setKeyIsValid(false);
      setLicenceKeyErrorMessage(t("invalidLicenseKey"));
    }
  }

  const onActivateSubmit = async (values) => {


    const msg = {
      name: name,
      email: email,
      phone: `+${phone}`,
      city: city,
      country: country,
      key: key,
    };



    console.log("msg: ", values);
    console.log("activation start");


    sendChromeMessage({ data: values, type: "license_active" }, (response) => {

      if (response.status == true) {
        setIsLicenseValid(true);
        getLicenseDetails()
        // enqueueSnackbar(t(response.message), { variant: "success" });
      } else {
        setIsLicenseValid(false);
        // enqueueSnackbar(t(response.message));
        api.error({
          key: "error",
          message: t(response.message),
          duration: 2,
          placement: "bottomLeft",
        })
      }
    });
  };

  const onSaveSetting = (e) => {
    e.preventDefault();
    setShowValidation(true);

    let data = {
      exportForm: dataFormate,
      delay: delay,
      extractCol: extractCol,
      lang: selectLang
    };

    sendChromeMessage({ setting: data, type: "save_setting" }, (response) => {
      if (response.status) {
        notification.success({
          message: t("settingSave"),
          placement: "bottomLeft",
          duration: 3
        });
        i18next.changeLanguage(selectLang);
      } else {
        notification.error({
          message: t("settingSaveFailed"),
          placement: "bottomLeft",
          duration: 3
        });
      }
    });
  };


  const onScrape = (e) => {
    e.preventDefault();
    setShowValidation(true);
    if (keyword == "") {
      return enqueueSnackbar(t("keywordIsRequired"));
    }


    console.log("countryCode:", countryCode);

    const countryDialCode = "+" + countryList.find(
      (c) => c.countryNameEn == countryCode
    ).countryCallingCode;

    sendChromeMessage({
      keyword: keyword,
      location: location,
      network: network,
      country: countryDialCode,
      type: "scrap"
    }, (response) => {
      if (response.status == true) {
        enqueueSnackbar(t(response.message), { variant: "success" });
      } else {
        enqueueSnackbar(t(response.message));
      }
    });
  };

  const onDownloadScrapData = () => {
    sendChromeMessage(
      { type: "download", keyword: selectedKeywordId },
      (response) => {
        if (response.status == true) {
          enqueueSnackbar(t(response.message), { variant: "success" });
          setSelectedKeywordId("select");
        } else {
          api.error({
            key: "error",
            message: t(response.message),
            duration: 2,
            placement: "bottomLeft",
          })
        }
      }
    );
  };

  const onDeleteScrapData = () => {
    sendChromeMessage(
      { type: "delete_scrap", keyword: selectedKeywordId },
      (response) => {
        if (response.status == true) {
          api.success({
            key: "error",
            message: t(response.message),
            duration: 2,
            placement: "bottomLeft",
          })
          // enqueueSnackbar(t(response.message), { variant: "success" });
          setSelectedKeywordId("select");
          getScrapeData();
        }
      }
    );
  };

  const onClearScrapData = () => {
    sendChromeMessage(
      { type: "clear_scrap", keyword: selectedKeywordId },
      (response) => {

        if (response.status == true) {
          api.success({
            key: "error",
            message: t(response.message),
            duration: 2,
            placement: "bottomLeft",
          })
          setScrapData({});
        }
      }
    );
  };

  const get_youtube_thumbnail = (url, quality) => {
    if (url) {
      var video_id, thumbnail, result;
      if ((result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/))) {
        video_id = result.pop();
      } else if ((result = url.match(/youtu.be\/(.{11})/))) {
        video_id = result.pop();
      }

      if (video_id) {
        if (typeof quality == "undefined") {
          quality = "high";
        }

        var quality_key = "maxresdefault"; // Max quality
        if (quality == "low") {
          quality_key = "sddefault";
        } else if (quality == "medium") {
          quality_key = "mqdefault";
        } else if (quality == "high") {
          quality_key = "hqdefault";
        }

        var thumbnail =
          "http://img.youtube.com/vi/" + video_id + "/" + quality_key + ".jpg";
        return thumbnail;
      }
    }
    return false;
  };

  const getTrial = () => {
    sendChromeMessage({ type: "get_trial" }, (response) => {
      console.log("get one day trial demo", response)
      if (response.status) {
        setKey(response.key)
        enqueueSnackbar(response.message, { variant: "success" });
      } else {
        setKey(response.key)
        enqueueSnackbar(response.message, { variant: "error" });
      }

    })
  }
  const getVersion = () => {

    sendChromeMessage({ type: "get_version" }, (response) => {
      console.log("Background  check version0", response);
      // let data = response.version.replace(/\./g, "");
      setLocalmanifestVersion(response.version)

    });

  }
  const updateCancel = () => {
    let data = product?.forceUpdate ?? ""
    if (data) {
      setIsUpdate(true)
    } else {
      console.error("data", data)
      setIsUpdate(false);
    }

  };

  const totalSlider = () => {
    var count = 0;
    if (product != null) {
      if (product.showAd) {
        count++;
      }

      if (
        product.demoVideoUrl != "" &&
        (product.demoVideoUrl ?? "").includes("youtube.com")
      ) {
        count++;
      }
    }

    return count;
  };
  console.log("Product Site URL:", product?.siteUrl);
  console.log("Buy URL:", rData?.buy_url);

  return (
    <>
      {contextHolder}
      <ConfigProvider theme={theme} >
        <Modal
          styles={{ body: { margin: 0, } }}
          title={t("renewLicense")}
          open={renewOpen}
          onCancel={renewCloseForm}
          footer={[
            <Button key="renew" type="primary" onClick={renewLicenseKey}>
              {t("renew")}
            </Button>,
            product && rData?.active_shop && (
              <Button key="buy">
                <a href={product?.siteUrl || rData?.buy_url} target="_blank" rel="noopener noreferrer">
                  {t("buyNow")}
                </a>
              </Button>
            ),
          ]}
        >
          <Input
            value={renewKey}
            onChange={(e) => setRenewKey(e.target.value)}
            placeholder={t("enterLicenseKey")}
            prefix={<MailOutlined />}
            suffix={keyIsValid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          />
          <Paragraph>{t("renewDBMbeforeExpire")}</Paragraph>
          <Paragraph>{t("subscription1Y")}</Paragraph>
          <Paragraph>{t("subscription3M")}</Paragraph>
          <Paragraph>{t("subscription1M")}</Paragraph>
        </Modal>

        <div style={{ backgroundColor: theme.token.colorPrimary, padding: 12, opacity: 0.9, height: "70px" }}>
          <Space align="center" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <img src={logo} alt={product?.name ?? ""} style={{ width: 45, height: 45 }} />
            <Title level={4} style={{ color: "white", margin: 0 }}>
              {rData?.name ?? t("imName")}
            </Title>
          </Space>
          {isLicenseValid && (
            <Space style={{ display: "flex", justifyContent: "center", width: "100%", alignItems: "center" }}>
              <Text style={{ color: "white", fontSize: "12px" }}>{t("expireDate")}</Text>
              <Tag color="cyan">{expireDate()}</Tag>
              <Tag onClick={renewOpenForm}>
                {t("renewLabel")}
              </Tag>
            </Space>
          )}
        </div>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
            <Spin tip={t("loading")} />
          </div>
        ) : (
          <div>
            {isLicenseValid ? (
              <>
                <Modal styles={{ body: { margin: 0, } }}
                  open={isUpdate}
                  onCancel={updateCancel}
                  footer={null}
                  closable={!product?.forceUpdate}
                >
                  {/* <a href={product?.updateUrl ?? ""} target="_blank" rel="noopener noreferrer">
                    <img src={product?.updateBannerUrl ?? ""} alt="" style={{ width: "100%" }} />
                  </a> */}
                </Modal>
                <div style={{ backgroundColor: "rgb(24, 29, 59)", padding: "8px 16px" }}>
                  <Row justify="center" align="middle">
                    {TAB_ITEMS.map((x, i) => (
                      <Col span={6} key={"tab-" + i} style={{ textAlign: "center" }}>
                        <Button
                          type={selectedTabId === x ? "default" : "text"}
                          onClick={() => setSelectedTabId(x)}
                          size="middle"
                          align="center"
                          style={{ color: selectedTabId === x ? "black" : "white" }}
                        >
                          {t(x)}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </div>
                <div>
                  {selectedTabId === "home" && (
                    <>
                      <Form style={{ maxHeight: "500px", marginTop: "-30px", padding: "25px" }}>
                        <Title level={5}>{t("welcome")} {licenseDetails?.name ?? ""}</Title>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              validateStatus={keyword === "" && showValidation ? "error" : ""}
                              help={keyword === "" && showValidation ? t("keywordIsRequired") : ""}
                            >
                              <Input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder={t("keyword")}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              validateStatus={location === "" && showValidation ? "error" : ""}
                              help={location === "" && showValidation ? t("locationReq") : ""}
                            >
                              <Input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder={t("enterLocation")}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Select
                              value={network}
                              onChange={setNetwork}
                              style={{ width: "100%" }}
                              placeholder={t("network")}
                            >
                              <Option value="facebook">{t("facebook")}</Option>
                              <Option value="twitter">{t("twitter")}</Option>
                              <Option value="linkedin">{t("linkedin")}</Option>
                              <Option value="instagram">{t("instagram")}</Option>
                            </Select>
                          </Col>
                          <Col span={12}>
                            <Select
                              value={countryCode}
                              onChange={setCountryCode}
                              style={{ width: "100%" }}
                              placeholder={t("selectCountry")}
                              showSearch
                            >
                              {countryList.map((x) => (
                                <Option key={x.countryCode} value={x.countryNameEn}>
                                  {x.countryNameEn}
                                </Option>
                              ))}
                            </Select>
                          </Col>
                        </Row>
                        <Button
                          onClick={onScrape}
                          type="primary"
                          htmlType="submit"
                          style={{ marginTop: 10, display: "block", marginLeft: "auto", marginRight: "auto" }}

                        >
                          {t("start")}
                        </Button>
                        {/* Add slider content here if needed */}
                      </Form>
                      <Row gutter={[16, 16]} justify="center">
                        <Col xs={24}>
                          <Space direction="vertical" style={{ width: "100%", marginTop: "10px" }}>
                            {product && (
                              <Carousel
                                autoplay
                                autoplaySpeed={15000}
                                dotPosition="bottom"
                                beforeChange={(current, next) => setActiveStep(next)}
                                style={{ maxHeight: "250px", overflow: "hidden" }}
                              >
                                {/* Ad Banner */}
                                {product.showAd && product.adBannerUrl && (
                                  <Typography.Link href={product.adBannerUrl} target="_blank" style={{ display: "block", textAlign: "center" }}>
                                    <img src={product.adBannerUrl} alt="Ad Banner" style={{ height: 200, maxWidth: "100%" }} />
                                  </Typography.Link>
                                )}

                                {/* YouTube Video Thumbnail */}
                                {product.demoVideoUrl && product.demoVideoUrl.includes("youtube.com") && (
                                  <Typography.Link href={product.demoVideoUrl} target="_blank" style={{ position: "relative", display: "block" }}>
                                    <PlayCircleOutlined
                                      style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        fontSize: "110px",
                                        color: "grey",
                                        opacity: 0.8,
                                        mixBlendMode: "exclusion",
                                      }}
                                    />
                                    <img
                                      src={get_youtube_thumbnail(product.demoVideoUrl, "high")}
                                      alt="YouTube Video"
                                      style={{ height: 200, maxWidth: 350, width: "100%", display: "flex", alignItems: "center" }}
                                    />
                                  </Typography.Link>
                                )}
                              </Carousel>
                            )}
                          </Space>
                        </Col>

                        {/* Navigation Buttons */}
                        <Flex justify="space-between" style={{ width: "100%", marginTop: "-15px" }}>
                          <Button
                            type="text"
                            size="small"
                            onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                            disabled={activeStep === 0}
                          >
                            {themeslider.direction === "rtl" ? <RightOutlined /> : <LeftOutlined />}
                            Back
                          </Button>
                          <Button
                            type="text"
                            size="small"
                            onClick={() => setActiveStep((prev) => Math.min(prev + 1, totalSlider() - 1))}
                            disabled={activeStep === totalSlider() - 1}
                          >
                            Next
                            {themeslider.direction === "rtl" ? <LeftOutlined /> : <RightOutlined />}
                          </Button>

                        </Flex>
                        {/* <Row  style={{ marginTop: "-15px" , display:"flex", justifyContent:"space-between"}}>
                              <Col>
                                <Button
                                  type="text"
                                  size="small"
                                  onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                                  disabled={activeStep === 0}
                                >
                                  {themeslider.direction === "rtl" ? <RightOutlined /> : <LeftOutlined />}
                                  Back
                                </Button>
                              </Col>

                              <Col>
                                <Button
                                  type="text"
                                  size="small"
                                  onClick={() => setActiveStep((prev) => Math.min(prev + 1, totalSlider() - 1))}
                                  disabled={activeStep === totalSlider() - 1}
                                >
                                  Next
                                  {themeslider.direction === "rtl" ? <LeftOutlined /> : <RightOutlined />}
                                </Button>
                              </Col>
                            </Row> */}

                      </Row>
                    </>


                  )}

                  {selectedTabId === "data" && (
                    <div style={{ padding: 12 }}>
                      {Object.keys(scrapData).length === 0 ? (
                        <Text type="warning">{t("noDataFound")}</Text>
                      ) : (
                        <>
                          <Select
                            value={selectedKeywordId}
                            onChange={setSelectedKeywordId}
                            style={{ width: "100%", marginBottom: 16 }}
                            size="large"
                            placeholder={t("selectKeyword")}
                          >
                            <Option value="select">Select</Option>
                            {Object.keys(scrapData).map((key) => (
                              <Option key={key} value={key}>
                                {scrapData[key].name}
                              </Option>
                            ))}
                          </Select>
                          {selectedKeywordId !== "select" && (
                            <>
                              <Space direction="vertical">
                                <Text>
                                  {t("totalData")}: {(scrapData[selectedKeywordId]?.data ?? []).length}
                                </Text>
                                <Text>
                                  {t("lastDate")}: {dateFormat(scrapData[selectedKeywordId]?.createdAt, true)}
                                </Text>
                              </Space>
                              <Row justify="center" style={{ marginTop: 16 }}>
                                <Space>
                                  <Button type="primary" onClick={onDownloadScrapData}>
                                    {t("download")}
                                  </Button>
                                  <Button danger onClick={onDeleteScrapData}>
                                    {t("delete")}
                                  </Button>
                                </Space>
                              </Row>
                            </>
                          )}
                          <Button
                            danger
                            type="dashed"
                            onClick={onClearScrapData}
                            style={{ marginTop: 16, display: "block", marginLeft: "auto", marginRight: "auto" }}
                          >
                            {t("clearAll")}
                          </Button>

                        </>
                      )}
                    </div>
                  )}

                  {selectedTabId === "setting" && (
                    <Form onFinish={onSaveSetting} style={{ padding: "24px" }}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label={t("delay")}>
                            <Input
                              type="number"
                              value={delay}
                              onChange={(e) => setDelay(e.target.value)}
                              min={1}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label={t("language")}>
                            <Select
                              value={selectLang}
                              onChange={setSelectLang}
                              showSearch // Enables searching
                              filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase()) // Filters based on user input
                              }
                              style={{ width: "100%" }}
                              placeholder={t("selectLanguage")}
                            >
                              {langList.map((x) => (
                                <Select.Option key={x.key} value={x.key}>
                                  {x.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                      </Row>
                      <Title level={5}>{t("extractingCol")}</Title>
                      <Row>
                        {columns.map((col) => (
                          <Col span={12} key={col.value}>
                            <Checkbox
                              checked={extractCol[col.value]}
                              onChange={(e) =>
                                setExtractCol((ec) => ({
                                  ...ec,
                                  [col.value]: e.target.checked,
                                }))
                              }
                            >
                              {t(col.label)}
                            </Checkbox>
                          </Col>
                        ))}
                      </Row>
                      <Button onClick={onSaveSetting}

                        type="primary"
                        style={{ marginTop: 16, display: "block", marginLeft: "auto", marginRight: "auto" }}
                      >
                        {t("save")}
                      </Button>
                    </Form>
                  )}

                  {selectedTabId === "help" && (
                    <div style={{ padding: "24px", marginTop: "-29px" }}>
                      <Title level={5}>{t("helpMsg")}</Title>
                      <Paragraph style={{ fontSize: "0.8rem" }}>{t("contactWithEmail")}</Paragraph>
                      <List style={{ marginTop: "-15px" }}
                        dataSource={[
                          { icon: <PhoneOutlined />, title: t("phone"), value: rData?.active_shop ? product?.contactNumber : rData?.phone, href: "tel:" },
                          { icon: <MailOutlined />, title: t("email"), value: rData?.active_shop ? product?.email : rData?.email, href: "mailto:" },
                          { icon: <GlobalOutlined />, title: t("website"), value: rData?.active_shop ? product?.siteUrl : rData?.siteUrl, href: "" },
                        ].filter(item => item.value)}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar icon={item.icon} />}
                              title={item.title}
                              description={<a href={`${item.href}${item.value}`} target="_blank" rel="noopener noreferrer">{item.value}</a>}
                            />
                          </List.Item>
                        )}
                      />
                      <Title level={5} style={{ marginTop: "-10px" }}>{t("disclaimer")}:</Title>
                      <Paragraph style={{ fontSize: "0.8rem" }}>{t("certified")}</Paragraph>
                    </div>
                  )}
                </div>
                <div style={{ position: "absolute", bottom: 0, width: "100%", textAlign: "center" }}>
                  <Row justify="center" align="middle">
                    <Typography.Text type="secondary">
                      {`V ${localmanifestVersion?.localVersion ?? ""}`}
                    </Typography.Text>
                  </Row>
                </div>

              </>
            ) : (
              <Form
                form={form}
                style={{ padding: 12, maxWidth: 400, margin: "0 auto" }}
                layout="vertical"
                onFinish={() => {
                  form.validateFields().then(onActivateSubmit);
                }} // Handles form submission
              >
                {/* Name */}
                <Form.Item name="name" rules={[{ required: true, message: t("nameRequired") }]}>
                  <Input prefix={<VscAccount style={{ fontSize: "1.2rem" }} />} placeholder={t("enterName")} />
                </Form.Item>

                {/* Email */}
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: t("emailRequired") },
                    { type: "email", message: t("emailInvalid") }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder={t("enterEmail")} />
                </Form.Item>

                {/* Phone */}
                <Form.Item name="phone" rules={[{ required: true, message: t("phoneRequired") }]}>
                  <PhoneInput country={"in"} inputStyle={{ width: "100%" }} />
                </Form.Item>

                {/* City */}
                <Form.Item name="city" rules={[{ required: true, message: t("cityRequired") }]}>
                  <Input prefix={<IoHomeOutline style={{ fontSize: "1.2rem" }} />} placeholder={t("enterCity")} />
                </Form.Item>

                {/* Country */}
                <Form.Item name="country" rules={[{ required: true, message: t("selectCountry") }]}>
                  {/* <IoLocationOutline style={{ fontSize: "1.2rem" }} /> */}

                  <Select prefix={<IoLocationOutline style={{ fontSize: "1.2rem" }} />} placeholder={t("selectCountry")} showSearch>
                    {countryList.map((x) => (
                      <Option key={x.countryCode} value={x.countryNameEn}>
                        {x.countryNameEn}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>


                {/* License Key */}
                <Form.Item
                  name="key"
                  rules={[
                    { required: true, message: t("enterLicenseKey") },
                    () => ({
                      validator(_, value) {
                        if (!value || keyIsValid) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(licenceKeyErrorMessage));
                      },
                    }),
                  ]}
                >
                  <Input prefix={<MdKey style={{ fontSize: "1.2rem" }} />} suffix={keyIsValid ? <CheckCircleOutlined /> : <CloseCircleOutlined />} placeholder={t("enterLicenseKey")} />
                </Form.Item>

                {/* Get Trial */}
                <Form.Item style={{ textAlign: "right", marginTop: "-10px" }}>
                  <Text style={{ cursor: "pointer" }} onClick={getTrial}>
                    {t("getTrial")}
                  </Text>
                </Form.Item>

                {/* Buttons */}
                <Flex justify="center">
                  <Space>
                    <Button type="primary" htmlType="submit">
                      {t("activate")}
                    </Button>
                    {(product?.siteUrl || rData?.buy_url) && (
                      <Button>
                        <a href={product?.siteUrl || rData?.buy_url} target="_blank" rel="noopener noreferrer">
                          {t("buyNow")}
                        </a>
                      </Button>
                    )}
                  </Space>
                </Flex>
              </Form>
            )}
          </div>
        )}
      </ConfigProvider >
    </>

  );
};

export default FormComponent;