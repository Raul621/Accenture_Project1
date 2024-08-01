sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        JSONModel,
        Fragment,
        MessageBox,
        MessageToast,
    ) {
        "use strict";
        return Controller.extend("project1.controller.View1", {
            onInit: function () {
                var oApplicationModel = new JSONModel("./model/data.json");
                this.getView().setModel(oApplicationModel, "applicationModel");
            },
            /**
             * After Rendering
             */
            onAfterRendering: function () {
                this.getView().getModel("applicationModel").setProperty("/Wizard", {
                    Step2CostCenter: "07",
                    Step1_2TextValue: "Langlaufer Werkzeugbestellung"

                });
                var oModel = this.getView().getModel("applicationModel");
                var oToday = new Date();
                oToday.setDate(oToday.getDate() + 1);
                var sMinDate = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }).format(oToday);
                // Set the minDate property in the model
                oModel.setProperty("/minDate", sMinDate);

            },
            onPressTile: function (oEvent) {
                var clickedTileId = oEvent.getSource().getId();
                var wizard = this.getView().byId("wizard");
                var wizardStep = this.getView().byId("step1");

                // Remove style class from all tiles
                this.getView().byId("tile1").removeStyleClass("babyBlueColor");
                this.getView().byId("tile2").removeStyleClass("babyBlueColor");
                this.getView().byId("tile3").removeStyleClass("babyBlueColor");

                // Add style class to the clicked tile
                oEvent.getSource().addStyleClass("babyBlueColor");

                wizard.validateStep(wizard.getProgressStep());

                // // Remove existing subsequent steps
                // wizardStep.removeAllSubsequentSteps();

                if (oEvent.getSource().getId()[oEvent.getSource().getId().length - 1] == '1') {
                    this.getView().byId("step1").setNextStep(this.getView().byId("wizard_1_2"));
                } else if (oEvent.getSource().getId()[oEvent.getSource().getId().length - 1] == '2') {
                    this.getView().byId("step1").setNextStep(this.getView().byId("wizard_2_2"));
                } else if (oEvent.getSource().getId()[oEvent.getSource().getId().length - 1] == '3') {
                    this.getView().byId("step1").setNextStep(this.getView().byId("wizard_3_2"));
                }

                wizard.validateStep(wizard.getProgressStep());


                // Fire complete event and navigate to the next step
                wizard.getProgressStep().fireComplete();
                wizard.nextStep();
            },


            // -------------------------------------------------- STEP 1 ------------------------------------------------------------- //
            onPressNextStep1: function () {
                var oView = this.getView();
                this.getView().byId("tile1").setState("Disabled");
                this.getView().byId("tile2").setState("Disabled");
                this.getView().byId("tile3").setState("Disabled");
                var oModel = this.getView().getModel("applicationModel");
                oModel.setProperty("/Wizard/Step2CostCenterValueState", "None");
                this.getView().byId("inputStep2").setValue("07");
                this.getView().byId("inputStep_2_2").setValue("Langlaufer Werkzeugbestellung");

            },


            // -------------------------------------------------- STEP 2 ------------------------------------------------------------- //
            /**
             * Handler for cost center input in step2 fragment
             * @param {*} oEvent 
             */
            onLiveChangeInputStep2: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();

                if (!sValue.startsWith("07")) {
                    sValue = "07" + sValue.slice(2);
                    oInput.setValue(sValue);
                }

                if (sValue.length === 4 && /^\d+$/.test(sValue)) {
                    this.getView().byId("wizard").validateStep(this.getView().byId("wizard").getProgressStep());
                } else {
                    this.getView().byId("wizard").getProgressStep().setValidated(false);
                }

                if (sValue.length > 4) {
                    oInput.setValue(sValue.slice(0, 4));
                    this.getView().byId("wizard").validateStep(this.getView().byId("wizard").getProgressStep());
                }

                var bValid = false;
                if (!/^\d+$/.test(sValue)) {
                    bValid = false;
                } else if (bValid) {
                    oInput.setValueState("None");
                }
            },
            onLiveChangeInputStep2Summary: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();

                if (!sValue.startsWith("07")) {
                    sValue = "07" + sValue.slice(2);
                    oInput.setValue(sValue);
                }

                if (sValue.length === 4 && /^\d+$/.test(sValue)) {
                } else {
                    this.getView().byId("wizard").getProgressStep().setValidated(false);
                }

                if (sValue.length > 4) {
                    oInput.setValue(sValue.slice(0, 4));
                }

                var bValid = false;
                if (!/^\d+$/.test(sValue)) {
                    bValid = false;
                } else if (bValid) {
                    oInput.setValueState("None");
                }
            },
            /**
             *  Disable fields when click on next step
             */
            onPressNextStep2: function (oEvent) {
                this.getView().byId("inputStep2").setEditable(false);
                var oModel = this.getView().getModel("applicationModel");
                var sCostCenter = this.getView().byId("inputStep2").getValue();
                oModel.setProperty("/Wizard/Step2CostCenter", sCostCenter);
            },

            // -------------------------------------------------- STEP 3 ------------------------------------------------------------- //
            /**
             * Write a value for the next table to show
             * @param {*} oEvent 
            */
            onLiveChangeInputStep3: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                if (sValue.length > 0) {
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step3Verwendung", sValue);
                    this.getView().byId("wizard").validateStep(this.getView().byId("wizard").getProgressStep());
                    oInput.setValueState("None"); // Clear any error state
                } else {
                    this.getView().byId("wizard").invalidateStep(this.getView().byId("wizard").getProgressStep());
                }
            },
            onLiveChangeInputStep310: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                if (sValue.length > 0) {
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step3Verwendung", sValue);
                    this.getView().byId("wizard").invalidateStep(this.getView().byId("wizard").getProgressStep());
                    this.getView().getModel("applicationModel").setProperty("/wizardStep10NextButtonVisible", false);
                    oInput.setValueState("None"); // Clear any error state
                } else {
                    this.getView().byId("wizard").invalidateStep(this.getView().byId("wizard").getProgressStep());
                    this.getView().getModel("applicationModel").setProperty("/wizardStep10NextButtonVisible", false);
                }
            },
            onLiveChangeInputStep310Summary: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                if (sValue.length > 0) {
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step3Verwendung", sValue);
                    this.getView().getModel("applicationModel").setProperty("/wizardStep10NextButtonVisible", false);
                    oInput.setValueState("None"); // Clear any error state
                } else {
                    this.getView().getModel("applicationModel").setProperty("/wizardStep10NextButtonVisible", false);
                }
            },
            onPressNextStep3: function (oEvent) {
                var aBauphaseSet = this.getView().getModel("applicationModel").getProperty("/Derivate_Baukasten_ProjectSet");

                this.getView().byId("txtStep3").setEditable(false);
                this.getView().getModel("applicationModel").setProperty("/Step4Values", aBauphaseSet);

                var oModel = this.getView().getModel("applicationModel");
                var Step3Verwendung = this.getView().byId("txtStep3").getValue();
                oModel.setProperty("/Wizard/Step3Verwendung", Step3Verwendung);
            },
            // -------------------------------------------------- STEP 4 ------------------------------------------------------------- //
            onChangeComboBoxStep4: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                var oValidatedComboBox = oEvent.getSource(),
                    sSelectedKey = oValidatedComboBox.getSelectedKey(),
                    sValue = oValidatedComboBox.getValue();

                if (!sSelectedKey || sValue === null) {
                    this.getView().byId("wizard").getProgressStep().setValidated(false);
                    oValidatedComboBox.setValueState("Error");
                    oValidatedComboBox.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msg.combo-validation"));
                } else {
                    oValidatedComboBox.setValueState("None");
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step4SelectedValue", oEvent.getSource().getSelectedItem().getText());
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step5SelectedValue", oEvent.getSource().getSelectedItem().getText());
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step123SelectedValue", oEvent.getSource().getSelectedItem().getText());
                    this.getView().byId("wizard").validateStep(this.getView().byId("wizard").getProgressStep());
                }
            },
            onPressNextStep4: function (oEvent) {
                var aBauphaseSet = this.getView().getModel("applicationModel").getProperty("/MT_BBG_VorserieSet");
                this.getView().getModel("applicationModel").setProperty("/Step5Values", aBauphaseSet);
                this.getView().byId("comboStep4").setEditable(false);
                var oModel = this.getView().getModel("applicationModel");
                var step4Value = this.getView().byId("comboStep4").getValue();
                oModel.setProperty("/Wizard/Step4SelectedValue", step4Value);
            },
            // -------------------------------------------------- STEP 5 ------------------------------------------------------------- //
            onChangeComboBoxStep5: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                var oValidatedComboBox = oEvent.getSource(),
                    sSelectedKey = oValidatedComboBox.getSelectedKey(),
                    sValue = oValidatedComboBox.getValue();

                if (!sSelectedKey || sValue === null) {
                    this.getView().byId("wizard").getProgressStep().setValidated(false);
                    oValidatedComboBox.setValueState("Error");
                    oValidatedComboBox.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msg.combo-validation"));
                } else {
                    oValidatedComboBox.setValueState("None");
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step5SelectedValue", oEvent.getSource().getSelectedItem().getText());
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step51SelectedValue", oEvent.getSource().getSelectedItem().getText());
                    this.getView().byId("wizard").validateStep(this.getView().byId("wizard").getProgressStep());
                }
            },
            onChangeComboBoxStep5Summary: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                var oValidatedComboBox = oEvent.getSource(),
                    sSelectedKey = oValidatedComboBox.getSelectedKey(),
                    sValue = oValidatedComboBox.getValue();

                if (!sSelectedKey || sValue === null) {
                    this.getView().byId("wizard").getProgressStep().setValidated(false);
                    oValidatedComboBox.setValueState("Error");
                    oValidatedComboBox.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msg.combo-validation"));
                } else {
                    oValidatedComboBox.setValueState("None");
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step5SelectedValue", oEvent.getSource().getSelectedItem().getText());
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step51SelectedValue", oEvent.getSource().getSelectedItem().getText());
                }
            },
            onChangeComboBoxStep124: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                var oValidatedComboBox = oEvent.getSource(),
                    sSelectedKey = oValidatedComboBox.getSelectedKey(),
                    sValue = oValidatedComboBox.getValue();

                if (!sSelectedKey || sValue === null) {
                    this.getView().byId("wizard").getProgressStep().setValidated(false);
                    oValidatedComboBox.setValueState("Error");
                    oValidatedComboBox.setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msg.combo-validation"));
                } else {
                    oValidatedComboBox.setValueState("None");
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step124SelectedValue", oEvent.getSource().getSelectedItem().getText());
                    this.getView().byId("wizard").validateStep(this.getView().byId("wizard").getProgressStep());
                }
            },
            onPressNextStep5: function (oEvent) {
                this.getView().byId("comboStep5").setEditable(false);
            },
            _filterUserDetails: function (aUserDetails) {
                var aFilters = [];
                var oFilterBar = this.byId("fbVerwenderSearch");
                var aFilterItems = oFilterBar.getFilterGroupItems();

                aFilterItems.forEach(function (oFilterItem) {
                    var sValue = oFilterItem.getControl().getValue();
                    if (sValue) {
                        aFilters.push({
                            path: oFilterItem.getName(),
                            value: sValue
                        });
                    }
                });
                var aFilteredUsers = aUserDetails.filter(function (oUser) {
                    return aFilters.every(function (oFilter) {
                        return oUser[oFilter.path].toLowerCase().includes(oFilter.value.toLowerCase());
                    });
                });
                this.getView().getModel("applicationModel").setProperty("/Step5VerwenderList", aFilteredUsers);
            },
            // -------------------------------------------------- STEP 6 ------------------------------------------------------------- //
            onPressButtonYesStep6: function (oEvent) {
                this.getView().byId("btnYesStep6").setPressed(true);
                this.getView().byId("btnNoStep6").setPressed(false);
                var oCurrentLoggedOnUser = this.getView().getModel("applicationModel").getProperty("/AuthorizationSet");
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step5Verwender", oCurrentLoggedOnUser);
                this.getView().byId("scVerwenderStep5").setVisible(false);
                var oModel = this.getView().getModel();
                var oView = this.getView();
                var oTable = oView.byId("VerwenderSearchTable");
                oTable.removeSelections();
                oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
            },
            onPressButtonYesStep6Option2: function (oEvent) {
                this.getView().byId("btnYesStep6Option2").setPressed(true);
                this.getView().byId("btnNoStep6Option2").setPressed(false);
                var oCurrentLoggedOnUser = this.getView().getModel("applicationModel").getProperty("/AuthorizationSet");
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step5Option2Verwender", oCurrentLoggedOnUser);
                this.getView().byId("scVerwenderStep5Option2").setVisible(false);
                var oModel = this.getView().getModel();
                var oView = this.getView();
                var oTable = oView.byId("VerwenderSearchTableOption2");
                oTable.removeSelections();
                oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
            },


            onPressButtonNoStep6: function (oEvent) {
                var oView = this.getView();
                oView.byId("btnYesStep6").setPressed(false);
                oView.byId("btnNoStep6").setPressed(true);
                oView.byId("scVerwenderStep5").setHeight("300px");
                var oModel = this.getView().getModel("applicationModel");
                oModel.setProperty("/bRestartVisibility", true);
                var that = this;
                jQuery.getJSON("./model/data.json", function (data) {
                    // Update model properties based on data.json
                    oModel.setProperty("/bFirstPanelVisible", false);
                    oModel.setProperty("/bSecondPanelVisible", false);
                    oModel.setProperty("/bThirdPanelVisible", true);

                    that._filterUserDetails(data.User_detailsSet);
                    oModel.setProperty("/Step5VerwenderList", data.User_detailsSet); // Assuming Step5VerwenderList represents filtered data

                    oView.byId("panelVerwender1").setExpanded(true);
                });
                var oView = this.getView();
                oView.byId("wizard").invalidateStep(oView.byId("wizard").getProgressStep());

            },
            onPressButtonNoStep6Option2: function (oEvent) {
                var oView = this.getView();
                oView.byId("btnYesStep6Option2").setPressed(false);
                oView.byId("btnNoStep6Option2").setPressed(true);
                oView.byId("scVerwenderStep5Option2").setHeight("300px");
                var oModel = this.getView().getModel("applicationModel");
                oModel.setProperty("/bRestartVisibility", true);
                var that = this;
                jQuery.getJSON("./model/data.json", function (data) {
                    // Update model properties based on data.json
                    oModel.setProperty("/bFirstPanelVisible", false);
                    oModel.setProperty("/bSecondPanelVisible", false);
                    oModel.setProperty("/bThirdPanelVisible", true);

                    that._filterUserDetails(data.User_detailsSet);
                    oModel.setProperty("/Step17VerwenderList", data.User_detailsSet); // Assuming Step5VerwenderList represents filtered data

                    oView.byId("panelVerwender1").setExpanded(true);
                });
                var oView = this.getView();
                oView.byId("wizard").invalidateStep(oView.byId("wizard").getProgressStep());

            },
            onPressNextStep6: function (oEvent) {
                var btnYesStep7 = this.getView().byId("btnYesStep6");
                var btnNoStep7 = this.getView().byId("btnNoStep6");
                var oCurrentLoggedOnUser = this.getView().getModel("applicationModel").getProperty("/AuthorizationSet");
                this.getView().getModel("applicationModel").setProperty("/Wizard/CurrentLoggedOnUser", oCurrentLoggedOnUser);
                btnYesStep7.setEnabled(false);
                btnNoStep7.setEnabled(false);
                var oView = this.getView();
                oView.byId("fbVerwenderSearch").setVisible(false);
                oView.byId("scVerwenderStep5").setVisible(false);
                oView.byId("VerwenderSearchTable").setVisible(false);
                oView.byId("VerwenderSearchTable").setVisible(false);
                oView.byId("fbVerwenderSearch").setVisible(false);
                oView.byId("scVerwenderStep5").setVisible(false);

                var oPanel = this.getView().byId("panelVerwender1");
                if (oPanel) {
                    oPanel.setExpanded(false);
                    oPanel.setVisible(false);
                }
            },
            onPressClearSearchVerwenderStep6: function () {
                var oFilterBar = this.getView().byId("fbVerwenderSearch");
                if (oFilterBar) {
                    var aFilterItems = oFilterBar.getFilterGroupItems();
                    aFilterItems.forEach(function (oFilterItem) {
                        var oControl = oFilterItem.getControl();
                        if (oControl.setValue) {
                            oControl.setValue("");
                        }
                    });
                    oFilterBar.fireSearch();
                }
            },
            onPressClearSearchVerwenderStep6Option2: function () {
                var oFilterBar = this.getView().byId("fbVerwenderSearchOption2");
                if (oFilterBar) {
                    var aFilterItems = oFilterBar.getFilterGroupItems();
                    aFilterItems.forEach(function (oFilterItem) {
                        var oControl = oFilterItem.getControl();
                        if (oControl.setValue) {
                            oControl.setValue("");
                        }
                    });
                    oFilterBar.fireSearch();
                }
            },
            onPressSearchVerwenderStep6: function () {
                var oFilterBar = this.getView().byId("fbVerwenderSearch");
                var oTable = this.getView().byId("VerwenderSearchTable");

                if (oFilterBar && oTable) {
                    var aFilters = [];
                    var aFilterItems = oFilterBar.getFilterGroupItems();

                    aFilterItems.forEach(function (oFilterItem) {
                        var sValue = oFilterItem.getControl().getValue();
                        if (sValue) {
                            var oFilter = new sap.ui.model.Filter(oFilterItem.getName(), sap.ui.model.FilterOperator.Contains, sValue);
                            aFilters.push(oFilter);
                        }
                    });
                    var oBinding = oTable.getBinding("items");
                    oBinding.filter(aFilters);
                }
            },
            onPressSearchVerwenderStep6Option2: function () {
                var oFilterBar = this.getView().byId("fbVerwenderSearchOption2");
                var oTable = this.getView().byId("VerwenderSearchTableOption2");

                if (oFilterBar && oTable) {
                    var aFilters = [];
                    var aFilterItems = oFilterBar.getFilterGroupItems();

                    aFilterItems.forEach(function (oFilterItem) {
                        var sValue = oFilterItem.getControl().getValue();
                        if (sValue) {
                            var oFilter = new sap.ui.model.Filter(oFilterItem.getName(), sap.ui.model.FilterOperator.Contains, sValue);
                            aFilters.push(oFilter);
                        }
                    });
                    var oBinding = oTable.getBinding("items");
                    oBinding.filter(aFilters);
                }
            },
            onPressSelectVerwenderStep6: function (oEvent) {
                var oView = this.getView();
                oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
                var oSelectedItem = oEvent.getParameter("listItem");
                var oContext = oSelectedItem.getBindingContext("applicationModel");
                var oSelectedUser = oContext.getObject();
                var oModel = this.getView().getModel("applicationModel");
                oModel.setProperty("/Wizard/Step5Verwender", oSelectedUser);
                var oDialog = this.getView().byId("VerwenderDetailsDialog");
                if (oDialog) {
                    oDialog.close();
                }
                var oView = this.getView();
                oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
            },
            onPressSelectVerwenderStep6Option2: function (oEvent) {
                var oView = this.getView();
                oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
                var oSelectedItem = oEvent.getParameter("listItem");
                var oContext = oSelectedItem.getBindingContext("applicationModel");
                var oSelectedUser = oContext.getObject();
                var oModel = this.getView().getModel("applicationModel");
                oModel.setProperty("/Wizard/Step5Option2Verwender", oSelectedUser);
                var oDialog = this.getView().byId("VerwenderDetailsDialog");
                if (oDialog) {
                    oDialog.close();
                }
                var oView = this.getView();
                oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
            },
            onPressSearchBenutzerStep7: function () {
                var that = this;
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterBenutzerDetails(data.User_detailsSet);
                });
            },
            onPressClearSearchBenutzerStep7: function () {
                var that = this;
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Clear all filter values
                var oFilterBar = oView.byId("fbBenutzersuche");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                    var sControlId = oFilterItem.getControl().getId();
                    var oControl = sap.ui.getCore().byId(sControlId);
                    if (oControl instanceof sap.m.Input) {
                        oControl.setValue("");
                    }
                });
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterBenutzerDetails(data.User_detailsSet);
                });
            },
            _filterBenutzerDetails: function (aUserDetails) {
                var aFilters = [];
                var oFilterBar = this.byId("fbBenutzersuche");
                var aFilterItems = oFilterBar.getFilterGroupItems();

                aFilterItems.forEach(function (oFilterItem) {
                    var sValue = oFilterItem.getControl().getValue();
                    if (sValue) {
                        aFilters.push({
                            path: oFilterItem.getName(),
                            value: sValue.toLowerCase()  // Convert value to lowercase for case-insensitive comparison
                        });
                    }
                });

                var aFilteredUsers = aUserDetails.filter(function (oUser) {
                    return aFilters.every(function (oFilter) {
                        // Use includes() for partial match; change to === if exact match is needed
                        return oUser[oFilter.path].toLowerCase().includes(oFilter.value);
                    });
                });

                this.getView().getModel("applicationModel").setProperty("/BenutzersucheList", aFilteredUsers);
            },

            _filterExternalReceivers: function (aExternalReceivers) {
                var aFilters = [];
                var oFilterBar = this.byId("fbExternalReceivers");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                    var sValue = oFilterItem.getControl().getValue();
                    if (sValue) {
                        aFilters.push({
                            path: oFilterItem.getName(),
                            value: sValue.toLowerCase()
                        });
                    }
                });
                var aFilteredItems = aExternalReceivers.filter(function (oItem) {
                    return aFilters.every(function (oFilter) {
                        return oItem[oFilter.path] && oItem[oFilter.path].toLowerCase().includes(oFilter.value);
                    });
                });
                this.getView().getModel("applicationModel").setProperty("/BenutzersucheList", aFilteredItems);
            },

            // -------------------------------------------------- STEP 7 ------------------------------------------------------------- //

            onPressClear1SearchAdressStep7: function () {
                var oModel = this.getView().getModel("applicationModel");
                oModel.setProperty("/ConstructionSite", "");
                oModel.setProperty("/LocationPart", "");
                oModel.setProperty("/LocationDescription", "");
                oModel.setProperty("/Sup_Cust_nr", "");
                var that = this;
                jQuery.getJSON("./model/data.json", function (data) {
                    oModel.setProperty("/LocationDetailsSet", data.LocationDetailsSet);
                    that._filterLocationDetails(data.LocationDetailsSet); // Optionally filter after clearing
                });
            },

            onPressSearch1AdressStep7: function () {
                var that = this;
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");
                var aData = oModel.getProperty("/LocationDetailsSet"); // Original dataset
                var oFilterBar = oView.byId("fbBenutzerStandort");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                var sConstructionSite = "";
                var sLocationPart = "";
                var sLocationDescription = "";
                var sSupCustNr = "";
                aFilterItems.forEach(function (oFilterItem) {
                    var sItemName = oFilterItem.getName();
                    var sControlId = oFilterItem.getControl().getId();

                    // Match each input field by name
                    switch (sItemName) {
                        case "Bauort":
                            sConstructionSite = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        case "Standortteil":
                            sLocationPart = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        case "LocationDescription": // Adjust for LocationDescription
                            sLocationDescription = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        case "Sup_Cust_nr": // Adjust for Sup_Cust_nr
                            sSupCustNr = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        default:
                            break;
                    }
                });
                var aFilteredData = aData.filter(function (item) {
                    return (!sConstructionSite || item.ConstructionSite.includes(sConstructionSite)) &&
                        (!sLocationPart || item.LocationPart.includes(sLocationPart)) &&
                        (!sLocationDescription || item.LocationDescription.includes(sLocationDescription)) &&
                        (!sSupCustNr || item.Sup_Cust_nr.includes(sSupCustNr));
                });

                oModel.setProperty("/BenutzerStandortList", aFilteredData); // Update table data
            },
            _filterLocationDetails: function (aLocationDetails) {
                var oModel = this.getView().getModel("applicationModel");
                var sConstructionSite = oModel.getProperty("/ConstructionSite");
                var sLocationPart = oModel.getProperty("/LocationPart");
                var sLocationDescription = oModel.getProperty("/LocationDescription");
                var sSupCustNr = oModel.getProperty("/Sup_Cust_nr");

                var aFilteredData = aLocationDetails.filter(function (item) {
                    return (!sConstructionSite || item.ConstructionSite.includes(sConstructionSite)) &&
                        (!sLocationPart || item.LocationPart.includes(sLocationPart)) &&
                        (!sLocationDescription || item.LocationDescription.includes(sLocationDescription)) &&
                        (!sSupCustNr || item.Sup_Cust_nr.includes(sSupCustNr));
                });

                oModel.setProperty("/BenutzerStandortList", aFilteredData);
            },
            onActivateStep7: function (oEvent) {
                var oView = this.getView();
                oView.byId("panelBenutzersuche").setVisible(false);
                oView.byId("panelBenutzerStandort").setVisible(false);
                oView.byId("panelBenutsersucheLieferung").setVisible(false);
            },

            onPressButtonYesStep7: function (oEvent) {
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");
                oModel.setProperty("/Sup_Cust_nr", "");
                oModel.setProperty("/Department", "");
                oModel.setProperty("/Street", "");
                oModel.setProperty("/Land", "");
                oModel.setProperty("/PLZ", "");
                oModel.setProperty("/Ort", "");

                if (oModel.getProperty("/RadioButtonSelected") !== "OptionA") {
                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver", {}); // Clear external receiver data if switching to Option A

                    // Clear fields related to Option B if needed
                    oModel.setProperty("/Wizard/Step7SelectedInternalUser/Sup_Cust_nr", "");
                    oModel.setProperty("/Wizard/Step7SelectedInternalUser/Department", "");
                    oModel.setProperty("/Wizard/Step7SelectedInternalUser/Street", "");
                    oModel.setProperty("/Wizard/Step7SelectedInternalUser/Country_ZIP_Place", "");
                    oModel.setProperty("/Wizard/Step7SelectedInternalUser/Contact_Person", "");
                    oModel.setProperty("/Wizard/Step7SelectedInternalUser/Phone", "");
                }
                var lblSupplier = this.getView().byId("SupplierLabel"); // Adjust this ID to match your internal receiver label
                lblSupplier.setRequired(false);
                var lblSupplier = this.getView().byId("InternalLabel"); // Adjust this ID to match your internal receiver label
                lblSupplier.setRequired(true);

                // Clear the FilterBar inputs
                var oFilterBar = oView.byId("fbExternalReceivers");
                oFilterBar.fireClear();

                // Deselect any selected items in the Table
                var oTable = oView.byId("tableExternalReceivers");
                oTable.removeSelections();

                // Perform any additional actions needed
                oView.byId("panelBenutzersuche").setVisible(true);
                oView.byId("panelBenutzerStandort").setVisible(true);
                oView.byId("panelBenutsersucheLieferung").setVisible(false);

                // Load or refresh data as needed
                var that = this;
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterExternalReceivers(data.User_detailsSet);
                    that._filterLocationDetails(data.LocationDetailsSet);
                    oModel.setProperty("/User_detailsSet", data.User_detailsSet);
                    oModel.setProperty("/LocationDetailsSet", data.LocationDetailsSet);
                });

                // Expand the relevant panels and validate the wizard step
                oView.byId("panelBenutzersuche").setExpanded(true);
                this.handleReceiverChangeSummary();

                // Invalidate the current wizard step
                oView.byId("wizard").invalidateStep(oView.byId("wizard_7"));
                oModel.setProperty("/RadioButtonSelected", "OptionA");

                // Set button states
                oView.byId("btnYesStep7").setPressed(true);
                oView.byId("btnNoStep7").setPressed(false);
            },
            onPressButtonNoStep7: function (oEvent) {
                var oView = this.getView();
                oView.byId("btnYesStep7").setPressed(false);
                oView.byId("btnNoStep7").setPressed(true);

                var oModel = oView.getModel("applicationModel");

                oView.byId("panelBenutzersuche").setVisible(false);
                oView.byId("panelBenutzerStandort").setVisible(false);
                oView.byId("panelBenutsersucheLieferung").setVisible(true);

                /// Mereu Afisam: panel+filterbar+table
                oView.byId("fbExternalReceivers").setVisible(true);
                oView.byId("tableExternalReceivers").setVisible(true);

                oView.byId("VerwenderSearchTable").setVisible(false);
                oView.byId("fbVerwenderSearch").setVisible(false);
                oView.byId("scVerwenderStep5").setVisible(false);

                if (oModel.getProperty("/RadioButtonSelected") !== "OptionB") {
                    oModel.setProperty("/Wizard/Step7SelectedInternalUser", {}); // Clear internal user data if switching to Option B


                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver/Sup_Cust_nr", "");
                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver/Department", "");
                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver/Street", "");
                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver/Country_ZIP_Place", "");
                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver/Contact_Person", "");
                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver/Phone", "");

                    var oModel = this.getView().getModel("applicationModel");
                    oModel.setProperty("/Wizard/Step7SelectedInternalUserStandort/ConstructionSite", "");
                    oModel.setProperty("/Wizard/Step7SelectedInternalUserStandort/LocationPart", "");
                    oModel.setProperty("/Wizard/Step7SelectedInternalUserStandort/Sup_Cust_nr", "");
                }
                var lblSupplier = this.getView().byId("SupplierLabel"); // Adjust this ID to match your internal receiver label
                lblSupplier.setRequired(true);
                var lblSupplier = this.getView().byId("InternalLabel"); // Adjust this ID to match your internal receiver label
                lblSupplier.setRequired(false);
                var oFilterBar = oView.byId("fbBenutzersuche");
                oFilterBar.fireClear();
                var oView = this.getView();
                oView.byId("wizard").invalidateStep(oView.byId("wizard").getProgressStep());
                this.handleReceiverChangeOption6Summary();
                // Deselect any selected items in the Table
                var oTable = oView.byId("tableBenutzersuche");
                oTable.removeSelections();
                var oFilterBar = oView.byId("fbBenutzerStandort");
                oFilterBar.fireClear();
                // Deselect any selected items in the Table
                var oTable = oView.byId("tableBenutzerStandort");
                oTable.removeSelections();
                var oModel = oView.getModel("applicationModel");
                var that = this;
                jQuery.getJSON("./model/data.json", function (data) {
                    oModel.setProperty("/External_receiverSet", data.External_receiverSet);
                    that._filterBenucheLiefrung(data.External_receiverSet);
                });
                var oPanel11 = this.getView().byId("panelBenutzersuche");
                oPanel11.setExpanded(false);
                var oPanel12 = this.getView().byId("panelBenutzerStandort");
                oPanel12.setExpanded(false);
                oModel.setProperty("/RadioButtonSelected", "OptionB");
                oView.byId("panelBenutsersucheLieferung").setExpanded(true);
            },

            onPressNextStep7: function (oEvent) {
                var oView = this.getView();
                // Hide elements related to the 'Benutzersuche' panel
                oView.byId("panelBenutzersuche").setVisible(false);
                oView.byId("scbenutzerStep7").setVisible(false);
                oView.byId("tableBenutzersuche").setVisible(false);
                // Hide elements related to the 'Location' panel
                oView.byId("panelBenutzerStandort").setVisible(false);
                oView.byId("scLocationStep7").setVisible(false);
                oView.byId("tableBenutzerStandort").setVisible(false);
                // Optionally, you can disable buttons as required
                var btnYesStep7 = oView.byId("btnYesStep7");
                var btnNoStep7 = oView.byId("btnNoStep7");
                if (btnYesStep7) {
                    btnYesStep7.setEnabled(false);
                }
                if (btnNoStep7) {
                    btnNoStep7.setEnabled(false);
                }
                var oDatePicker = oView.byId("datePickerStep8");
                oDatePicker.attachBrowserEvent("paste", function (event) {
                    event.preventDefault();
                });
                oDatePicker.attachBrowserEvent("keydown", function (event) {
                    event.preventDefault();
                });
                oDatePicker.attachBrowserEvent("keypressed", function (event) {
                    event.preventDefault();
                });
            },
            onPressSelectBenutzerStep7: function (oEvent) {
                try {
                    var oSelectedItem = oEvent.getParameter("listItem");
                    if (!oSelectedItem) {
                        return;
                    }
                    var oContext = oSelectedItem.getBindingContext("applicationModel");
                    if (!oContext) {
                        return;
                    }
                    var oSelectedUser = oContext.getObject();
                    if (!oSelectedUser) {
                        return;
                    }
                    var oModel = this.getView().getModel("applicationModel");
                    oModel.setProperty("/Wizard/Step7SelectedInternalUser", oSelectedUser);
                    oModel.setProperty("/Wizard/Step7SelectedInternalUser/PhoneNr", oSelectedUser.PhoneNr);
                    oModel.setProperty("/bSecondPanelVisible", true);

                    // Clear data related to btnNoStep7
                    oModel.setProperty("/Wizard/Step7SelectedInternalUserStandort", {});
                    oModel.setProperty("/bThirdPanelVisible", false);
                    var oView=this.getView();
                    oView.byId("panelBenutzerStandort").setVisible(true);
                    oView.byId("scLocationStep7").setVisible(true);
                    oView.byId("tableBenutzerStandort").setVisible(true);

                    var oPanel = this.getView().byId("panelBenutzerStandort");
                    if (oPanel) {
                        oPanel.setExpanded(true);
                    }

                    this.getView().byId("wizard").validateStep(this.getView().byId("wizard").getProgressStep());
                    this.checkAndValidateWizardStep();
                } catch (error) {
                    console.error("Error in onPressSelectBenutzerStep7:", error);
                }
            },

            onPressSelectLocationStep7: function (oEvent) {
                try {
                    var oSelectedItem = oEvent.getParameter("listItem");
                    if (!oSelectedItem) {
                        return;
                    }
                    var oContext = oSelectedItem.getBindingContext("applicationModel");
                    if (!oContext) {
                        return;
                    }
                    var oSelectedLocation = oContext.getObject();
                    if (!oSelectedLocation) {
                        return;
                    }
                    var oModel = this.getView().getModel("applicationModel");
                    oModel.setProperty("/Wizard/Step7SelectedInternalUserStandort", oSelectedLocation);
                    oModel.setProperty("/Wizard/Step7SelectedInternalUserStandort/Bauort", oSelectedLocation.ConstructionSite);
                    oModel.setProperty("/Wizard/Step7SelectedInternalUserStandort/Standorteill", oSelectedLocation.LocationPart);
                    oModel.setProperty("/Wizard/Step7SelectedInternalUserStandort/Sup_Cust_nr", oSelectedLocation.Sup_Cust_nr);
                    // oModel.setProperty("/bThirdPanelVisible", true);
                    // oModel.setProperty("/bSecondPanelVisible", false);
                    var oView=this.getView();
                    this.getView().byId("wizard").validateStep(this.getView().byId("wizard").getProgressStep());
                    this.checkAndValidateWizardStep();
                } catch (error) {
                    console.error("Error in onPressSelectLocationStep7:", error);
                }
                var oView = this.getView();
                oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
            },
            onPressSelectExternalReceiver: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oContext = oSelectedItem.getBindingContext("applicationModel");
                var oSelectedReceiver = oContext.getObject();
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step7SelectedExternalReceiver", oSelectedReceiver);
                var oStep7Selected = this.getView().getModel("applicationModel").getProperty("/Wizard/Step7SelectedExternalReceiver");

                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");
                // Clear data related to btnYesStep7
                oModel.setProperty("/Wizard/Step7SelectedInternalUser", {});
                oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
            },
            onPressSelectExternalReceiver15: function (oEvent) {
                try {
                    // Access the ComboBox control
                    var oComboBox = this.byId("comboBoxOpt2");

                    // Check if ComboBox is found
                    if (!oComboBox) {
                        jQuery.sap.log.error("ComboBoxOpt2 not found in onPressSelectExternalReceiver15");
                        return;
                    }

                    // Retrieve the selected key from the ComboBox
                    var sSelectedKey = oComboBox.getSelectedKey();

                    // Define the required key
                    var sRequiredKey = "A115 [Versuchsteilelager Parsdorf]"; // Adjust this to match the actual key if needed

                    // Retrieve the model
                    var oModel = this.getView().getModel("applicationModel");

                    // Check if model is found
                    if (!oModel) {
                        jQuery.sap.log.error("Model 'applicationModel' not found in onPressSelectExternalReceiver15");
                        return;
                    }

                    // Retrieve the wizard control
                    var oWizard = this.getView().byId("wizard");
                    if (!oWizard) {
                        jQuery.sap.log.error("Wizard not found in onPressSelectExternalReceiver15");
                        return;
                    }

                    // Update the model properties as necessary
                    oModel.setProperty("/Wizard/Step15SelectedExternalReceiver", {
                        SelectedKey: sSelectedKey
                    });

                    // Validate or invalidate the step based on the selected key
                    if (sSelectedKey === sRequiredKey) {
                        // If the required value is selected, validate the step
                        oWizard.validateStep(oWizard.getProgressStep());
                    } else {
                        // If the required value is not selected, invalidate the step
                        oWizard.invalidateStep(oWizard.getProgressStep());
                    }

                    // Call the checkAndValidateWizardStep method to perform additional validation
                    this.checkAndValidateWizardStep();

                } catch (error) {
                    jQuery.sap.log.error("Error in onPressSelectExternalReceiver15:", error);
                }
            },
            checkAndValidateWizardStep: function () {
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");
                var oSelectedUser = oModel.getProperty("/Wizard/Step7SelectedInternalUser");
                if (oSelectedUser) {
                    oView.byId("wizard").validateStep(oView.byId("wizard_7"));
                } else {
                    oView.byId("wizard").invalidateStep(oView.byId("wizard_7"));
                }
            },
            updateVisibilityBasedOnSelections: function () {
                var oModel = this.getView().getModel("applicationModel");
                var allSelectionsMade = oModel.getProperty("/Wizard/Step7SelectedInternalUser") &&
                    oModel.getProperty("/Wizard/Step7SelectedInternalUserStandort");
                oModel.setProperty("/bRestartVisibility", !allSelectionsMade);
            },
            _filterBenucheLiefrung: function (aExternalReceivers) {
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");
                // Retrieve filter values from application model
                var sLand = oModel.getProperty("/Land").toLowerCase();
                var sPLZ = oModel.getProperty("/PLZ").toLowerCase();
                var sOrt = oModel.getProperty("/Ort").toLowerCase();
                var aFilters = [];
                var oFilterBar = oView.byId("fbExternalReceivers");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                // Collect additional filters from FilterBar inputs
                aFilterItems.forEach(function (oFilterItem) {
                    var sValue = oFilterItem.getControl().getValue();
                    if (sValue) {
                        aFilters.push({
                            path: oFilterItem.getName(),
                            value: sValue.toLowerCase()
                        });
                    }
                });
                // Perform filtering based on collected filters
                var aFilteredItems = aExternalReceivers.filter(function (oItem) {
                    // Parse Country, ZIP, Place from Country_ZIP_Place field
                    var aCountryZipPlace = oItem["Country_ZIP_Place"] ? oItem["Country_ZIP_Place"].split(" / ") : ["", "", ""];
                    var sCountry = aCountryZipPlace[0].toLowerCase();
                    var sZIP = aCountryZipPlace[1].toLowerCase();
                    var sPlace = aCountryZipPlace[2].toLowerCase();
                    // Check matches for Country, ZIP, Place
                    var bCountryMatch = !sLand || sCountry.includes(sLand);
                    var bZIPMatch = !sPLZ || sZIP.includes(sPLZ);
                    var bPlaceMatch = !sOrt || sPlace.includes(sOrt);
                    // Apply additional filters collected from FilterBar inputs
                    var bAdditionalFiltersMatch = aFilters.every(function (oFilter) {
                        switch (oFilter.path) {
                            case "Land":
                                return sCountry.includes(oFilter.value);
                            case "PLZ":
                                return sZIP.includes(oFilter.value);
                            case "Ort":
                                return sPlace.includes(oFilter.value);
                            default:
                                return oItem[oFilter.path] && oItem[oFilter.path].toLowerCase().includes(oFilter.value);
                        }
                    });
                    return bCountryMatch && bZIPMatch && bPlaceMatch && bAdditionalFiltersMatch;
                });

                // Update the model with filtered items
                oModel.setProperty("/External_receiverSet", aFilteredItems);
            },
            onPressClearSearchExternalReceivers: function () {
                // Clear filter values in the model
                var oModel = this.getView().getModel("applicationModel");
                oModel.setProperty("/Sup_Cust_nr", "");
                oModel.setProperty("/Department", "");
                oModel.setProperty("/Street", "");
                oModel.setProperty("/Land", "");
                oModel.setProperty("/PLZ", "");
                oModel.setProperty("/Ort", "");
                var that = this;
                jQuery.getJSON("./model/data.json", function (data) {
                    oModel.setProperty("/External_receiverSet", data.External_receiverSet);
                });
            },

            onPressSearchExternalReceivers: function () {
                this._filterBenucheLiefrung(this.getView().getModel("applicationModel").getProperty("/External_receiverSet"));
            },

            // -------------------------------------------------- STEP 8 ------------------------------------------------------------- //

            onActivateStep8: function (oEvent) {
                var oDatePicker = this.byId("datePickerStep8");
                var oDatePicker10 = this.byId("datePickerStep10");
                var oToday = new Date();
                oToday.setDate(oToday.getDate() + 1); // Get tomorrow's date
                oDatePicker.setMinDate(oToday);
                oDatePicker10.setMinDate(oToday);
            },
            onPressNextStep8: function (oEvent) {
                var comboStep8 = this.byId("comboStep8");
                var datePickerStep8 = this.byId("datePickerStep8");

                if (comboStep8 && datePickerStep8) {
                    comboStep8.setEnabled(false);
                    datePickerStep8.setEnabled(false);
                }

                var oModel = this.getView().getModel("applicationModel");
                var step8TextValue = comboStep8.getValue();
                var step8DateValue = datePickerStep8.getValue();

                oModel.setProperty("/Wizard/Step8SelectedDeliveryDetails/SelectedText", step8TextValue);
                oModel.setProperty("/Wizard/Step8SelectedDeliveryDetails/SelectedDate", step8DateValue);
            },

            onChangeComboBoxStep8: function (oEvent) {
                var oComboBox = oEvent.getSource();
                var sSelectedText = oComboBox.getSelectedItem().getText();
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step8SelectedDeliveryDetails/SelectedText", sSelectedText);
                this.checkCompletionAndNavigate();
            },
            onChangeComboBoxStep8Summary: function (oEvent) {
                var oComboBox = oEvent.getSource();
                var sSelectedText = oComboBox.getSelectedItem().getText();
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step8SelectedDeliveryDetails/SelectedText", sSelectedText);
                // this.checkCompletionAndNavigate();
            },

            onDatePickerStep8Change: function (oEvent) {
                var oDatePicker = oEvent.getSource();
                var sValue = oDatePicker.getValue();

                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd/MM/yyyy" });
                var oDate = oDateFormat.parse(sValue);

                if (oDate) {
                    var sFormattedDate = oDateFormat.format(oDate);
                    oDatePicker.setValue(sFormattedDate);
                    var oModel = this.getView().getModel("applicationModel");
                    oModel.setProperty("/Wizard/Step8SelectedDeliveryDetails/SelectedDate", sFormattedDate);
                }

                this.checkCompletionAndNavigate();
            },

            onDatePickerStep8ChangeSummary: function (oEvent) {
                var oDatePicker = oEvent.getSource();
                var sValue = oDatePicker.getValue();

                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd/MM/yyyy" });
                var oDate = oDateFormat.parse(sValue);

                if (oDate) {
                    var sFormattedDate = oDateFormat.format(oDate);
                    oDatePicker.setValue(sFormattedDate);
                    var oModel = this.getView().getModel("applicationModel");
                    oModel.setProperty("/Wizard/Step8SelectedDeliveryDetails/SelectedDate", sFormattedDate);
                }

            },
            getTomorrowDate: function () {
                var oToday = new Date();
                oToday.setDate(oToday.getDate() + 1); // Set to tomorrow
                return oToday;
            },

            onLiveChangeDatePickerStep8: function (oEvent) {
                this.onDatePickerStep8Change(oEvent);
            },
            onLiveChangeDatePickerStep5: function (oEvent) {
                this.onDatePickerStep5Change(oEvent);
            },
            onLiveChangeDatePickerStep15: function (oEvent) {
                this.onDatePickerStep15Change(oEvent);
            },

            // Function to handle selection change in ComboBox
            onSelectionChangeComboBoxStep8: function (oEvent) {
                var oComboBox = oEvent.getSource();
                this._updateComboBoxState(oComboBox);
            },

            // Function to update ComboBox state
            _updateComboBoxState: function (oComboBox) {
                if (oComboBox.getSelectedKey() === "") {
                    oComboBox.setValueState("Error");
                    oComboBox.setValueStateText("This field is required.");
                } else {
                    oComboBox.setValueState("None");
                }

                this.checkCompletionAndNavigate();
            },
            checkCompletionAndNavigate: function () {
                var oComboBox = this.byId("comboStep8");
                var oDatePicker = this.byId("datePickerStep8");

                var bComboBoxCompleted = oComboBox.getSelectedKey() !== "";
                var bDatePickerCompleted = oDatePicker.getValue() !== "" && oDatePicker.getValueState() !== "Error";

                if (bComboBoxCompleted && bDatePickerCompleted) {
                    var oView = this.getView();
                    oView.byId("wizard").validateStep(oView.byId("wizard_8"));
                } else {
                    var oWizardStep = this.byId("wizard_8");
                    if (oWizardStep) {
                        oWizardStep.setValidated(false);
                    }
                }
            },
            onActivateStep9: function (oEvent) {
                var oPanel = this.getView().byId("panelAbgetstimmt");
                if (oPanel) {
                    oPanel.setExpanded(false);
                }
            },
            onPressButtonYesStep9: function () {
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Clear filter values in the model
                oModel.setProperty("/QX", "");
                oModel.setProperty("/Lastname", "");
                oModel.setProperty("/Firstname", "");
                oModel.setProperty("/Department", "");
                oModel.setProperty("/Email", "");

                // Clear the FilterBar inputs
                var oFilterBar = oView.byId("fbAbgestimmtSearch");
                oFilterBar.fireClear();

                // Deselect any selected items in the Table
                var oTable = oView.byId("tableAbgestimmtStep9");
                oTable.removeSelections();

                // Perform any additional actions needed for Step 9
                oModel.setProperty("/bFirstPanelVisible", true);
                oModel.setProperty("/bSecondPanelVisible", true);
                oModel.setProperty("/bThirdPanelVisible", false);
                oModel.setProperty("/bRestartVisibility", true);

                var oPanel = oView.byId("panelAbgetstimmt");
                if (oPanel) {
                    oPanel.setExpanded(true);
                }

                // Load or refresh data as needed
                var that = this;
                jQuery.getJSON("./model/data.json", function (data) {
                    // Update the model with new data if necessary
                    that._filterAbgestimmtDetails(data.User_detailsSet);
                });

                // Set button states if applicable
                oView.byId("BtnPressYes9").setPressed(true);
                oView.byId("BtnPressNo9").setPressed(false);

                var oView = this.getView();
                oView.byId("wizard").invalidateStep(oView.byId("wizard").getProgressStep());
            },
            onPressButtonNo9: function (oEvent) {
                var oModel = this.getView().getModel("applicationModel");

                var oView = this.getView();
                oView.byId("BtnPressYes9").setPressed(false);
                oView.byId("BtnPressNo9").setPressed(true);

                if (oModel) {
                    oModel.setProperty("/bFirstPanelVisible", false);
                    oModel.setProperty("/bFirstPanelExpanded", false);
                }

                // Clear the FilterBar inputs
                var oFilterBar = oView.byId("fbAbgestimmtSearch");
                oFilterBar.fireClear();

                // Deselect any selected items in the Table
                var oTable = oView.byId("tableAbgestimmtStep9");
                oTable.removeSelections();


                var oView = this.getView();
                oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
            },
            onPanelExpandCollapse: function (oEvent) {
                var oModel = this.getView().getModel("applicationModel");
                if (oModel) {
                    var bExpanded = oModel.getProperty("/bFirstPanelExpanded");
                    oModel.setProperty("/bFirstPanelExpanded", !bExpanded);
                }
            },
            onPressSearchAbgestimmtStep9: function () {
                var that = this;
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");
                var aData = oModel.getProperty("/User_detailsSet"); // Original dataset

                // Retrieve values from FilterBar inputs
                var oFilterBar = oView.byId("fbAbgestimmtSearch");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                var sQX = "";
                var sLastname = "";
                var sFirstname = "";
                var sDepartment = "";
                var sEmail = "";

                aFilterItems.forEach(function (oFilterItem) {
                    var sItemName = oFilterItem.getName();
                    var sControlId = oFilterItem.getControl().getId();

                    // Match each input field by name
                    switch (sItemName) {
                        case "QX":
                            sQX = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        case "Lastname":
                            sLastname = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        case "Firstname":
                            sFirstname = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        case "Department":
                            sDepartment = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        case "Email":
                            sEmail = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        default:
                            break;
                    }
                });
                // Perform filtering based on retrieved values
                var aFilteredData = aData.filter(function (item) {
                    return (!sQX || item.QX.includes(sQX)) &&
                        (!sLastname || item.Lastname.includes(sLastname)) &&
                        (!sFirstname || item.Firstname.includes(sFirstname)) &&
                        (!sDepartment || item.Department.includes(sDepartment)) &&
                        (!sEmail || item.Email.includes(sEmail));
                });

                oModel.setProperty("/AbgestimmtList", aFilteredData); // Update table data
            },
            onPressSearchAbgestimmtStep17: function () {
                var that = this;
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");
                var aData = oModel.getProperty("/User_detailsSet"); // Original dataset

                // Retrieve values from FilterBar inputs
                var oFilterBar = oView.byId("fbAbgestimmtSearch17");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                var sQX = "";
                var sLastname = "";
                var sFirstname = "";
                var sDepartment = "";
                var sEmail = "";

                aFilterItems.forEach(function (oFilterItem) {
                    var sItemName = oFilterItem.getName();
                    var sControlId = oFilterItem.getControl().getId();

                    // Match each input field by name
                    switch (sItemName) {
                        case "QX":
                            sQX = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        case "Lastname":
                            sLastname = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        case "Firstname":
                            sFirstname = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        case "Department":
                            sDepartment = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        case "Email":
                            sEmail = sap.ui.getCore().byId(sControlId).getValue();
                            break;
                        default:
                            break;
                    }
                });
                // Perform filtering based on retrieved values
                var aFilteredData = aData.filter(function (item) {
                    return (!sQX || item.QX.includes(sQX)) &&
                        (!sLastname || item.Lastname.includes(sLastname)) &&
                        (!sFirstname || item.Firstname.includes(sFirstname)) &&
                        (!sDepartment || item.Department.includes(sDepartment)) &&
                        (!sEmail || item.Email.includes(sEmail));
                });

                oModel.setProperty("/AbgestimmtList17", aFilteredData); // Update table data
            },

            onPressClearSearchAbgestimmtStep9: function () {
                var that = this;
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Clear all filter values
                var oFilterBar = oView.byId("fbAbgestimmtSearch");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                    var sControlId = oFilterItem.getControl().getId();
                    var oControl = sap.ui.getCore().byId(sControlId);
                    if (oControl instanceof sap.m.Input) {
                        oControl.setValue("");
                    }
                });

                // Retrieve original dataset and update the model
                jQuery.getJSON("./model/data.json", function (data) {
                    oModel.setProperty("/AbgestimmtList", data.User_detailsSet); // Update the data in the model
                });
            },
            onPressClearSearchAbgestimmtStep17: function () {
                var that = this;
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Clear all filter values
                var oFilterBar = oView.byId("fbAbgestimmtSearch17");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                    var sControlId = oFilterItem.getControl().getId();
                    var oControl = sap.ui.getCore().byId(sControlId);
                    if (oControl instanceof sap.m.Input) {
                        oControl.setValue("");
                    }
                });

                // Retrieve original dataset and update the model
                jQuery.getJSON("./model/data.json", function (data) {
                    oModel.setProperty("/AbgestimmtList17", data.User_detailsSet); // Update the data in the model
                });
            },
            _filterAbgestimmtDetails: function (aUserDetails) {
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Retrieve filters from FilterBar
                var aFilters = [];
                var oFilterBar = oView.byId("fbAbgestimmtSearch");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                    var sValue = oFilterItem.getControl().getValue();
                    if (sValue) {
                        aFilters.push({
                            path: oFilterItem.getName(),
                            value: sValue.toLowerCase()  // Convert value to lowercase for case-insensitive comparison
                        });
                    }
                });

                // Filter the provided user details based on filter values
                var aFilteredUsers = aUserDetails.filter(function (oUser) {
                    return aFilters.every(function (oFilter) {
                        return oUser[oFilter.path].toLowerCase().includes(oFilter.value);
                    });
                });

                // Update the model with filtered items
                oModel.setProperty("/AbgestimmtList", aFilteredUsers);
            },
            onPressSelectAbgestimmtStep9: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oContext = oSelectedItem.getBindingContext("applicationModel");
                var oSelectedUser = oContext.getObject();
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step9SelectedUser", oSelectedUser);
                this.getView().byId("wizard").nextStep();
                var oView = this.getView();
                oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
            },
            onPressSelectAbgestimmtStep17: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oContext = oSelectedItem.getBindingContext("applicationModel");
                var oSelectedUser = oContext.getObject();
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step17SelectedUser", oSelectedUser);
                this.getView().byId("wizard").nextStep();
                var oView = this.getView();
                oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
            },
            onPressNextStep9: function (oEvent) {
                var oView = this.getView();
                var btnYesStep9 = oView.byId("BtnPressYes9");
                var btnNoStep9 = oView.byId("BtnPressNo9");

                // Disable buttons
                if (btnYesStep9) {
                    btnYesStep9.setEnabled(false);
                }
                if (btnNoStep9) {
                    btnNoStep9.setEnabled(false);
                }

                // Collapse the panel
                var oPanel = oView.byId("panelAbgetstimmt");
                if (oPanel) {
                    oPanel.setExpanded(false);
                }

                oView.byId("panelAbgetstimmt").setVisible(false);
                oView.byId("scAbgestimmtStep9").setVisible(false);
                oView.byId("tableAbgestimmtStep9").setVisible(false);
            },
            // -------------------------------------------------- STEP 10 ------------------------------------------------------------- //
            onPressCreateSummaryHeader: function () {
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");
                var form = oView.byId("formSummary");
                var formContent = form.getContent();
                var allFieldsValid = true;
            
                formContent.forEach(function (field) {
                    if (field instanceof sap.m.Input || field instanceof sap.m.ComboBox || field instanceof sap.m.DatePicker || field instanceof sap.m.TextArea) {
                        if (field.getRequired && field.getRequired()) {
                            if (!field.getValue()) {
                                field.setValueState(sap.ui.core.ValueState.Error);
                                allFieldsValid = false;
                            } else {
                                field.setValueState(sap.ui.core.ValueState.None);
                            }
                        }
            
                        // Specific validation for cost center
                        if (field.getId().includes("txtStep111")) {
                            var sValue = field.getValue();
                            var isValidCostCenter = /^07\d{2}$/.test(sValue);
                            if (!isValidCostCenter) {
                                field.setValueState(sap.ui.core.ValueState.Error);
                                allFieldsValid = false;
                                oModel.setProperty("/validCostCenterFormat", false);
                            } else {
                                field.setValueState(sap.ui.core.ValueState.None);
                                oModel.setProperty("/validCostCenterFormat", true);
                            }
                        }
                    }
                }, this);
            
                if (allFieldsValid) {
                    MessageBox.success("Data successfully sent to backend!", {
                        title: "Success",
                        onClose: function () {
                            formContent.forEach(function (field) {
                                if (field.setEditable) {
                                    field.setEditable(false);
                                }
                                if (field.setEnabled) {
                                    field.setEnabled(false);
                                }
                            });
                            oModel.setProperty("/isStep10Valid", true);
                            oModel.setProperty("/isNextButtonEnabled", true); // Enable the next button
                            oView.byId("wizard").validateStep(oView.byId("wizard_10"));
            
                            // Disable the PW erstellen button
                            var oBtnCreatePW = oView.byId("btnCreatePW");
                            if (oBtnCreatePW) {
                                oBtnCreatePW.setEnabled(false);
                            }
                        },
                        styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer"
                    });
                } else {
                    var errorMessage = oModel.getProperty("/validCostCenterFormat") ? "Please fill in all required fields." : "Please correct the cost center format.";
            
                    MessageBox.error(errorMessage, {
                        title: "Error",
                        styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer"
                    });
                    oModel.setProperty("/isStep10Valid", false);
                    oModel.setProperty("/isNextButtonEnabled", false); // Keep the next button disabled
                    oView.byId("wizard").invalidateStep(oView.byId("wizard_10"));
                }
            },
            onActivateSummary: function () {
                var oView = this.getView();
                oView.byId("wizard").invalidateStep(oView.byId("wizard_10"));
            },
            validateInitialCostCenter: function () {
                var oModel = this.getView().getModel("applicationModel");
                var sValue = oModel.getProperty("/Wizard/Step2CostCenter");

                // Perform the initial validation
                var bValidCostCenterFormat = /^07\d{2}$/.test(sValue);
                if (bValidCostCenterFormat) {
                    oModel.setProperty("/validCostCenterFormat", true);
                    oModel.setProperty("/AlreadyValid", true);
                } else {
                    oModel.setProperty("/validCostCenterFormat", false);
                    oModel.setProperty("/AlreadyValid", false);
                }
            },
            onPressOpenSearchDialogSummaryOption6: function () {
                if (!this._dialogSummaryInterneAdresse) {
                    this._dialogSummaryInterneAdresse = Fragment.load({
                        id: this.getView().getId(),
                        name: "project1.view.fragments.UserSelectionDialog",
                        controller: this
                    });
                }
                this._dialogSummaryInterneAdresse.then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            },
            onSearchExternalUserSelect: function () {
                var that = this;

                // Simulate asynchronous data retrieval from JSON file (replace with actual implementation)
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterExternalUserDetails(data.External_receiverSet);
                });
            },

            _filterExternalUserDetails: function (aExternalUserDetails) {
                var aFilters = this._retrieveExternalUserFilters();

                var aFilteredUsers = aExternalUserDetails.filter(function (oUser) {
                    return aFilters.every(function (oFilter) {
                        // Use includes() for partial match; change to === if exact match is needed
                        return oUser[oFilter.path].toLowerCase().includes(oFilter.value);
                    });
                });

                this.getView().getModel("applicationModel").setProperty("/External_receiverSet", aFilteredUsers);
            },
            _retrieveExternalUserFilters: function () {
                var oFilterBar = this.byId("filterBarExternalUser");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                var aFilters = [];

                aFilterItems.forEach(function (oFilterItem) {
                    var sValue = oFilterItem.getControl().getValue();
                    if (sValue) {
                        aFilters.push({
                            path: oFilterItem.getName(),
                            value: sValue.toLowerCase()  // Convert value to lowercase for case-insensitive comparison
                        });
                    }
                });

                return aFilters;
            },
            onClearExternalUserSelect: function () {
                var that = this;
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Clear all filter values
                var oFilterBar = oView.byId("filterBarExternalUser");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                    var sControlId = oFilterItem.getControl().getId();
                    var oControl = sap.ui.getCore().byId(sControlId);
                    if (oControl instanceof sap.m.Input) {
                        oControl.setValue("");
                    }
                });

                // Retrieve original dataset asynchronously
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterExternalUserDetails(data.External_receiverSet);
                });
            },
            onUserSelectionChange: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oContext = oSelectedItem.getBindingContext("applicationModel");
                var oSelectedUser = oContext.getObject();
                var oModel = this.getView().getModel("applicationModel");
                oModel.setProperty("/Wizard/Step5Verwender", oSelectedUser);
                this.onUserSelectionDialogClose();
            },
            onUserSelectionDialogClose: function () {
                var oDialog = this.getView().byId("UserSelectionDialog");
                if (oDialog) {
                    oDialog.close();
                }
            },
            onUserSelectionChange: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oContext = oSelectedItem.getBindingContext("applicationModel");
                var oSelectedUser = oContext.getObject();

                this.getView().getModel("applicationModel").setProperty("/Wizard/Step7SelectedInternalUser", oSelectedUser);

                this.byId("UserSelectionDialog").close();
            },
            handleReceiverChangeSummary: function (oEvent) {
                var oModel = this.getView().getModel("applicationModel");

                // Enable internal receiver fields
                oModel.setProperty("/enabledBmwReceiver", true);
                oModel.setProperty("/enabledBmwReceiverInputs", true);

                // Disable and clear external receiver fields
                oModel.setProperty("/enabledExternalReceiver", false);
                oModel.setProperty("/Wizard/Step7SelectedExternalReceiver", {
                    Sup_Cust_nr: "",
                    Department: "",
                    Street: "",
                    Country_ZIP_Place: "",
                    Contact_Person: "",
                    Phone: ""
                });

                // Uncheck the external receiver radio button
                this.getView().byId("rbReceiverBBAOption6Summary").setSelected(false);

                // Toggle Wizard 7 buttons
                var btnYesStep7 = this.getView().byId("btnYesStep7");
                var btnNoStep7 = this.getView().byId("btnNoStep7");
                btnYesStep7.setPressed(true);
                btnNoStep7.setPressed(false);
                this.getView().byId("wizard").invalidateStep(this.getView().byId("wizard").getProgressStep());
            },
            handleReceiverChangeSummary18: function (oEvent) {
                var oModel = this.getView().getModel("applicationModel");

                // Enable internal receiver fields
                oModel.setProperty("/enabledBmwReceiver", true);
                oModel.setProperty("/enabledBmwReceiverInputs", true);

                // Disable and clear external receiver fields
                oModel.setProperty("/enabledExternalReceiver", false);
                oModel.setProperty("/Wizard/Step15SelectedExternalReceiver", {
                    Sup_Cust_nr: "",
                    Department: "",
                    Street: "",
                    Country_ZIP_Place: "",
                    Contact_Person: "",
                    Phone: ""
                });

                // Uncheck the external receiver radio button
                this.getView().byId("rbReceiverBBAOption6Summary18").setSelected(false);

                // Toggle Wizard 7 buttons
                var btnYesStep7Opt2 = this.getView().byId("btnYesStep7Opt2");
                var btnNoStep7Opt2 = this.getView().byId("btnNoStep7Opt2");
                btnYesStep7Opt2.setPressed(true);
                btnNoStep7Opt2.setPressed(false);
            },
            handleReceiverChangeOption6Summary18: function (oEvent) {
                var oModel = this.getView().getModel("applicationModel");

                // Enable external receiver fields
                oModel.setProperty("/enabledExternalReceiver", true);

                // Disable and clear internal receiver fields
                oModel.setProperty("/enabledBmwReceiver", false);
                oModel.setProperty("/enabledBmwReceiverInputs", false);
                oModel.setProperty("/Wizard/Step15SelectedInternalUser", {
                    QX: "",
                    Lastname: "",
                    Firstname: "",
                    Department: "",
                    Email: "",
                    PhoneNr: "",
                    ConstructionSite: "",
                    LocationPart: "",
                    Building: "",
                    RoomNumber: "",
                    Sup_Cust_nr: ""
                });

                // Uncheck the internal receiver radio button
                this.getView().byId("rbReceiverBMWSummary18").setSelected(false);

                // Toggle Wizard 7 buttons
                var btnYesStep7Opt2 = this.getView().byId("btnYesStep7Opt2");
                var btnNoStep7Opt2 = this.getView().byId("btnNoStep7Opt2");
                btnYesStep7Opt2.setPressed(false);
                btnNoStep7Opt2.setPressed(true);
            },
            handleReceiverChangeOption6Summary: function (oEvent) {
                var oModel = this.getView().getModel("applicationModel");

                // Enable external receiver fields
                oModel.setProperty("/enabledExternalReceiver", true);

                // Disable and clear internal receiver fields
                oModel.setProperty("/enabledBmwReceiver", false);
                oModel.setProperty("/enabledBmwReceiverInputs", false);
                oModel.setProperty("/Wizard/Step7SelectedInternalUser", {
                    QX: "",
                    Lastname: "",
                    Firstname: "",
                    Department: "",
                    Email: "",
                    PhoneNr: "",
                    ConstructionSite: "",
                    LocationPart: "",
                    Building: "",
                    RoomNumber: "",
                    Sup_Cust_nr: ""
                });

                // Uncheck the internal receiver radio button
                this.getView().byId("rbReceiverBMWSummary").setSelected(false);

                // Toggle Wizard 7 buttons
                var btnYesStep7 = this.getView().byId("btnYesStep7");
                var btnNoStep7 = this.getView().byId("btnNoStep7");
                btnYesStep7.setPressed(false);
                btnNoStep7.setPressed(true);
            },
            onPressOpenExternalSearchDialogSummaryOption6: function () {
                if (!this._dialogSummaryExterneAdresse) {
                    this._dialogSummaryExterneAdresse = Fragment.load({
                        id: this.getView().getId(),
                        name: "project1.view.fragments.ExternalUserDialog",
                        controller: this
                    });
                }
                this._dialogSummaryExterneAdresse.then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            },
            onExternalUserSelectionChange: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oContext = oSelectedItem.getBindingContext("applicationModel");
                var oSelectedUser = oContext.getObject();

                this.getView().getModel("applicationModel").setProperty("/Wizard/Step7SelectedExternalReceiver", oSelectedUser);

                this.byId("ExternalUserDialog").close();
            },
            onExternalUserSelectionDialogClose: function () {
                var oDialog = this.getView().byId("External");
                this.onClearExternalUserSelect();
                var oDialog = this.getView().byId("ExternalUserDialog");
                if (oDialog) {
                    oDialog.close();
                }
            },
            handleReceiverChangeSummary: function (oEvent) {
                var oModel = this.getView().getModel("applicationModel");

                // Enable internal receiver fields
                oModel.setProperty("/enabledBmwReceiver", true);
                oModel.setProperty("/enabledBmwReceiverInputs", true);

                // Disable and clear external receiver fields
                oModel.setProperty("/enabledExternalReceiver", false);
                oModel.setProperty("/Wizard/Step7SelectedExternalReceiver", {
                    Sup_Cust_nr: "",
                    Department: "",
                    Street: "",
                    Country_ZIP_Place: "",
                    Contact_Person: "",
                    Phone: ""
                });

                var lblSupplier = this.getView().byId("SupplierLabel"); // Adjust this ID to match your internal receiver label
                lblSupplier.setRequired(false);
                var lblSupplier = this.getView().byId("InternalLabel"); // Adjust this ID to match your internal receiver label
                lblSupplier.setRequired(true);

                // Uncheck the external receiver radio button
                this.getView().byId("rbReceiverBBAOption6Summary").setSelected(false);

                // Toggle Wizard 7 buttons
                var btnYesStep7 = this.getView().byId("btnYesStep7");
                var btnNoStep7 = this.getView().byId("btnNoStep7");
                btnYesStep7.setPressed(true);
                btnNoStep7.setPressed(false);
            },
            handleReceiverChangeOption6Summary: function (oEvent) {
                var oModel = this.getView().getModel("applicationModel");

                // Enable external receiver fields
                oModel.setProperty("/enabledExternalReceiver", true);

                // Disable and clear internal receiver fields
                oModel.setProperty("/enabledBmwReceiver", false);
                oModel.setProperty("/enabledBmwReceiverInputs", false);
                oModel.setProperty("/Wizard/Step7SelectedInternalUser", {
                    QX: "",
                    Lastname: "",
                    Firstname: "",
                    Department: "",
                    Email: "",
                    PhoneNr: "",
                    ConstructionSite: "",
                    LocationPart: "",
                    Building: "",
                    RoomNumber: "",
                    Sup_Cust_nr: ""
                });

                // Uncheck the internal receiver radio button
                this.getView().byId("rbReceiverBMWSummary").setSelected(false);

                var lblSupplier = this.getView().byId("SupplierLabel"); // Adjust this ID to match your internal receiver label
                lblSupplier.setRequired(true);
                var lblSupplier = this.getView().byId("InternalLabel"); // Adjust this ID to match your internal receiver label
                lblSupplier.setRequired(false);

                // Toggle Wizard 7 buttons
                var btnYesStep7 = this.getView().byId("btnYesStep7");
                var btnNoStep7 = this.getView().byId("btnNoStep7");
                btnYesStep7.setPressed(false);
                btnNoStep7.setPressed(true);
            },
            // VerWender Dialog
            onVerwenderDetailsSelectionChange: function () {
                if (!this._dialogSummaryVerwenderAdresse) {
                    this._dialogSummaryVerwenderAdresse = Fragment.load({
                        id: this.getView().getId(),
                        name: "project1.view.fragments.VerwenderDialog",
                        controller: this
                    });
                }
                this._dialogSummaryVerwenderAdresse.then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            },
            onVerwenderSelectionChange: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oContext = oSelectedItem.getBindingContext("applicationModel");
                var oSelectedUser = oContext.getObject();

                this.getView().getModel("applicationModel").setProperty("/Wizard/Step5VerwenderOption2", oSelectedUser);
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step5Verwender", oSelectedUser);

                this.onVerwenderDetailsSelectionDialogClose();
            },
            onVerwenderDetailsSelectionDialogClose: function () {
                var oDialog = this.getView().byId("VerwenderDialog");

                this.onPressClearVerwenderDetails();
                var oDialog = this.getView().byId("VerwenderDetailsDialog");
                if (oDialog) {
                    oDialog.close();
                }
            },
            validateSummaryForm: function () {
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");
                var bValid = true;

                // Clear any previous validation messages
                oView.byId("formSummary").getControlsByFieldGroupId("SummaryFormFields").forEach(function (oControl) {
                    oControl.setValueState("None");
                });

                // Validate each mandatory field
                var aMandatoryFields = [
                    "cboxDerivateSummary", // Example mandatory field IDs, adjust as per your actual form
                    "cboxDerivateSummary1",
                    "comboStep10",
                    "datePickerStep10",
                    "qxVerwenderSummaryOption6",
                    // Add other mandatory fields IDs here
                ];

                aMandatoryFields.forEach(function (sFieldId) {
                    var oControl = oView.byId(sFieldId);
                    if (!oControl.getValue()) {
                        oControl.setValueState("Error");
                        bValid = false;
                    }
                });

                return bValid;
            },
            onLiveChangeInputStep2: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();

                if (!sValue.startsWith("07")) {
                    sValue = "07" + sValue.slice(2);
                    oInput.setValue(sValue);
                }

                // Validate length and format
                if (sValue.length === 4 && /^\d+$/.test(sValue)) {
                    oInput.setValueState("None"); // Clear any previous error state
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step2CostCenterState", "None");
                    this.getView().byId("wizard").validateStep(this.getView().byId("wizard").getProgressStep());
                } else {
                    oInput.setValueState("Error");
                    this.getView().getModel("applicationModel").setProperty("/Wizard/Step2CostCenterState", "Error");
                    this.getView().byId("wizard").getProgressStep().setValidated(false);
                }

                // Limit input to maxLength
                if (sValue.length > 4) {
                    oInput.setValue(sValue.slice(0, 4));
                }
            },
            onAbgestimmtDetailsSelectionChange: function () {
                if (!this._dialogAbgestimmtDetails) {
                    this._dialogAbgestimmtDetails = Fragment.load({
                        id: this.getView().getId(),
                        name: "project1.view.fragments.AbgestimmtDialog",
                        controller: this
                    });
                }
                this._dialogAbgestimmtDetails.then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            },
            // Function to handle selection change in the dialog
            onAbgestimmtSelectionChange: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oContext = oSelectedItem.getBindingContext("applicationModel");
                var oSelectedUser = oContext.getObject();

                // Set selected user to the model path for Step9SelectedUser
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step51SelectedUser", oSelectedUser);
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step9SelectedUser", oSelectedUser);

                this.onAbgestimmtDetailsSelectionDialogClose();
            },
            onAbgestimmtDetailsSelectionDialogClose: function () {
                var oDialog = this.getView().byId("AbgestimmtDialog");
                this.onPressClearAbgestimmtStep7();

                // Close the dialog
                var oDialog = this.getView().byId("AbgestimmtDetailsDialog");
                if (oDialog) {
                    oDialog.close();
                }
            },
            onPressOpenSearchDialogBauortSummaryOption5: function () {
                if (!this._dialogSummaryExterneAdresse) {
                    this._dialogSummaryExterneAdresse = Fragment.load({
                        id: this.getView().getId(),
                        name: "project1.view.fragments.BauortDialog",
                        controller: this
                    });
                }
                this._dialogSummaryExterneAdresse.then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            },
            onPressExternalAdressDialogStandortSummaryOption6: function () {
                if (!this._dialogStandortSummaryAdresse) {
                    this._dialogStandortSummaryAdresse = Fragment.load({
                        id: this.getView().getId(),
                        name: "project1.view.fragments.ExternalAdressDialog",
                        controller: this
                    });
                }
                this._dialogStandortSummaryAdresse.then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            },
            onExternalAdressSelectionChange: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                if (oSelectedItem) {
                    var oContext = oSelectedItem.getBindingContext("applicationModel");
                    if (oContext) {
                        var oSelectedLocation = oContext.getObject();
                        if (oSelectedLocation) {
                            var oModel = this.getView().getModel("applicationModel");
                            oModel.setProperty("/Wizard/Step7SelectedInternalUserStandort", oSelectedLocation);
                            oModel.setProperty("/Wizard/Step51SelectedInternalUserStandort", oSelectedLocation);
                        }
                    }
                }
            },
            onLiveChangeInputStep10: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();

                if (!sValue.startsWith("07")) {
                    sValue = "07" + sValue.slice(2);
                    oInput.setValue(sValue);
                }

                // Validate length and format
                var bValidCostCenterFormat = /^07\d{2}$/.test(sValue);
                if (bValidCostCenterFormat) {
                    oInput.setValueState("None"); // Clear any previous error state
                    this.getView().getModel("applicationModel").setProperty("/validCostCenterFormat", true);
                    this.getView().getModel("applicationModel").setProperty("/AlreadyValid", true); // Set property to true
                } else {
                    oInput.setValueState("Error");
                    this.getView().getModel("applicationModel").setProperty("/validCostCenterFormat", false);
                    this.getView().getModel("applicationModel").setProperty("/AlreadyValid", false); // Set property to false
                }

                // Limit input to maxLength
                if (sValue.length > 4) {
                    oInput.setValue(sValue.slice(0, 4));
                }

                this.getView().byId("wizard").invalidateStep(this.getView().byId("wizard").getProgressStep());
                this.getView().getModel("applicationModel").setProperty("/wizardStep10NextButtonVisible", false);

            },
            onLiveChangeInputStep10Summary: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();

                if (!sValue.startsWith("07")) {
                    sValue = "07" + sValue.slice(2);
                    oInput.setValue(sValue);
                }

                // Validate length and format
                var bValidCostCenterFormat = /^07\d{2}$/.test(sValue);
                if (bValidCostCenterFormat) {
                    oInput.setValueState("None"); // Clear any previous error state
                    this.getView().getModel("applicationModel").setProperty("/validCostCenterFormat", true);
                    this.getView().getModel("applicationModel").setProperty("/AlreadyValid", true); // Set property to true
                } else {
                    oInput.setValueState("Error");
                    this.getView().getModel("applicationModel").setProperty("/validCostCenterFormat", false);
                    this.getView().getModel("applicationModel").setProperty("/AlreadyValid", false); // Set property to false
                }

                // Limit input to maxLength
                if (sValue.length > 4) {
                    oInput.setValue(sValue.slice(0, 4));
                }
                this.getView().getModel("applicationModel").setProperty("/wizardStep10NextButtonVisible", false);

            },
            onAbgesttimtSearchFilter: function () {
                var that = this;

                // Simulate asynchronous data retrieval from JSON file (replace with actual implementation)
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterAbgestimmtDetailsDialog(data.User_detailsSet);
                });
            },
            _filterAbgestimmtDetailsDialog: function (aUserDetails) {
                var aFilters = this._retrieveFiltersAbgstimmt();

                var aFilteredUsers = aUserDetails.filter(function (oUser) {
                    return aFilters.every(function (oFilter) {
                        // Use includes() for partial match; change to === if exact match is needed
                        return oUser[oFilter.path].toLowerCase().includes(oFilter.value);
                    });
                });

                this.getView().getModel("applicationModel").setProperty("/User_detailsSet", aFilteredUsers);
            },
            _filterAbgestimmtDetails: function (aUserDetails) {
                var aFilters = this._retrieveFiltersAbgstimmt();

                var aFilteredUsers = aUserDetails.filter(function (oUser) {
                    return aFilters.every(function (oFilter) {
                        // Use includes() for partial match; change to === if exact match is needed
                        return oUser[oFilter.path].toLowerCase().includes(oFilter.value);
                    });
                });

                this.getView().getModel("applicationModel").setProperty("/User_detailsSet", aFilteredUsers);
            },
            _retrieveFiltersAbgstimmt: function () {
                var oFilterBar = this.byId("fbAbgestimmtSearch");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                var aFilters = [];

                aFilterItems.forEach(function (oFilterItem) {
                    var sValue = oFilterItem.getControl().getValue();
                    if (sValue) {
                        aFilters.push({
                            path: oFilterItem.getName(),
                            value: sValue.toLowerCase()  // Convert value to lowercase for case-insensitive comparison
                        });
                    }
                });

                return aFilters;
            },
            _retrieveFiltersAbgstimmtDialog: function () {
                var oFilterBar = this.byId("filterBarAbgestimmtDetails");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                var aFilters = [];

                aFilterItems.forEach(function (oFilterItem) {
                    var sValue = oFilterItem.getControl().getValue();
                    if (sValue) {
                        aFilters.push({
                            path: oFilterItem.getName(),
                            value: sValue.toLowerCase()  // Convert value to lowercase for case-insensitive comparison
                        });
                    }
                });

                return aFilters;
            },
            onPressClearAbgestimmtStep7: function () {
                var that = this;
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Clear all filter values
                var oFilterBar = oView.byId("filterBarAbgestimmtDetails");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                    var sControlId = oFilterItem.getControl().getId();
                    var oControl = sap.ui.getCore().byId(sControlId);
                    if (oControl instanceof sap.m.Input) {
                        oControl.setValue("");
                    }
                });

                // Retrieve original dataset asynchronously
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterAbgestimmtDetailsDialog(data.User_detailsSet);
                });
            },
            onVerwenderSearchFilter: function () {
                var that = this;

                // Simulate asynchronous data retrieval from JSON file (replace with actual implementation)
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterVerwenderDetails(data.User_detailsSet);
                });
            },
            _filterVerwenderDetails: function (aUserDetails) {
                var aFilters = this._retrieveFiltersVerwender("filterBarVerwenderDetails");

                var aFilteredUsers = aUserDetails.filter(function (oUser) {
                    return aFilters.every(function (oFilter) {
                        // Use includes() for partial match; change to === if exact match is needed
                        return oUser[oFilter.path].toLowerCase().includes(oFilter.value);
                    });
                });

                this.getView().getModel("applicationModel").setProperty("/User_detailsSet", aFilteredUsers);
            },
            _retrieveFiltersVerwender: function (sFilterBarId) {
                var oFilterBar = this.byId(sFilterBarId);
                var aFilterItems = oFilterBar.getFilterGroupItems();
                var aFilters = [];

                aFilterItems.forEach(function (oFilterItem) {
                    var sValue = oFilterItem.getControl().getValue();
                    if (sValue) {
                        aFilters.push({
                            path: oFilterItem.getName(),
                            value: sValue.toLowerCase()  // Convert value to lowercase for case-insensitive comparison
                        });
                    }
                });

                return aFilters;
            },
            onPressClearVerwenderDetails: function () {
                var that = this;
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Clear all filter values
                var oFilterBar = oView.byId("filterBarVerwenderDetails");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                    var sControlId = oFilterItem.getControl().getId();
                    var oControl = sap.ui.getCore().byId(sControlId);
                    if (oControl instanceof sap.m.Input) {
                        oControl.setValue("");
                    }
                });

                // Retrieve original dataset asynchronously
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterVerwenderDetails(data.User_detailsSet);
                });
            },
            onUserSelectionSearchFilter: function () {
                var that = this;

                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterUserSelectDetails(data.User_detailsSet);
                });
            },
            _filterUserSelectDetails: function (aUserDetails) {
                var aFilters = this._retrieveFiltersUser("filterBarInternalSelection");

                var aFilteredUsers = aUserDetails.filter(function (oUser) {
                    return aFilters.every(function (oFilter) {
                        // Use includes() for partial match; change to === if exact match is needed
                        return oUser[oFilter.path].toLowerCase().includes(oFilter.value);
                    });
                });

                this.getView().getModel("applicationModel").setProperty("/User_detailsSet", aFilteredUsers);
            },
            _retrieveFiltersUser: function (sFilterBarId) {
                var oFilterBar = this.byId(sFilterBarId);
                var aFilterItems = oFilterBar.getFilterGroupItems();
                var aFilters = [];

                aFilterItems.forEach(function (oFilterItem) {
                    var sValue = oFilterItem.getControl().getValue();
                    if (sValue) {
                        aFilters.push({
                            path: oFilterItem.getName(),
                            value: sValue.toLowerCase()  // Convert value to lowercase for case-insensitive comparison
                        });
                    }
                });

                return aFilters;
            },
            onPressClearUserSelectDetails: function () {
                var that = this;
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Clear all filter values
                var oFilterBar = oView.byId("filterBarInternalSelection");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                    var sControlId = oFilterItem.getControl().getId();
                    var oControl = sap.ui.getCore().byId(sControlId);
                    if (oControl instanceof sap.m.Input) {
                        oControl.setValue("");
                    }
                });

                // Retrieve original dataset asynchronously
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterVerwenderDetails(data.User_detailsSet);
                });
            },
            onInternalUserSelectionDialogClose: function () {
                var oDialog = this.getView().byId("Internal");

                this.onPressClearUserSelectDetails();
                var oDialog = this.getView().byId("UserSelectionDialog");
                if (oDialog) {
                    oDialog.close();
                }
            },
            //----------------------External User Dialog Functions----------------------------- 
            onExternalSelectionSearchFilter: function () {
                var that = this;

                // Simulate asynchronous data retrieval from JSON file (replace with actual implementation)
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterExternalSelectDetails(data.External_receiverSet);
                });
            },
            _filterExternalSelectDetails: function (aUserDetails) {
                var aFilters = this._retrieveFiltersExternal("filterBarExternalUserAdress");

                var aFilteredUsers = aUserDetails.filter(function (oUser) {
                    return aFilters.every(function (oFilter) {
                        // Use includes() for partial match; change to === if exact match is needed
                        return oUser[oFilter.path].toLowerCase().includes(oFilter.value);
                    });
                });

                this.getView().getModel("applicationModel").setProperty("/External_receiverSet", aFilteredUsers);
            },
            _retrieveFiltersExternal: function (sFilterBarId) {
                var oFilterBar = this.byId(sFilterBarId);
                var aFilterItems = oFilterBar.getFilterGroupItems();
                var aFilters = [];

                aFilterItems.forEach(function (oFilterItem) {
                    var sValue = oFilterItem.getControl().getValue();
                    if (sValue) {
                        aFilters.push({
                            path: oFilterItem.getName(),
                            value: sValue.toLowerCase()  // Convert value to lowercase for case-insensitive comparison
                        });
                    }
                });

                return aFilters;
            },
            onPressClearExternalSelectDetails: function () {
                var that = this;
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Clear all filter values
                var oFilterBar = oView.byId("filterBarExternalUserAdress");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                    var sControlId = oFilterItem.getControl().getId();
                    var oControl = sap.ui.getCore().byId(sControlId);
                    if (oControl instanceof sap.m.Input) {
                        oControl.setValue("");
                    }
                });

                // Retrieve original dataset asynchronously
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterExternalSelectDetails(data.External_receiverSet);
                });
            },
            onExternalDialogClose: function () {
                var oDialog = this.getView().byId("External");

                this.onPressClearExternalSelectDetails();
                var oDialog = this.getView().byId("ExternalAdressDialog");
                if (oDialog) {
                    oDialog.close();
                }
            },
            //----------------------------------------------------- WIZZARD STEP 11 -----------------------------------------------------------------
            onPressPlusStep11: function () {
                var oModel = this.getView().getModel("applicationModel");
                if (!oModel) {
                    return;
                }
            
                // Add a new row with initial values
                var initialRow = {
                    partNumber: "",
                    additionalPartNumber: "",
                    aiValid: "",
                    aiDeviant: "",
                    koGruppe: "",
                    module: "",
                    modulOrg: "",
                    identnummer: "",
                    comm: "",
                    stuckAuslosung: "",
                    partNumberEnabled: true,
                    additionalPartNumberEnabled: false,
                    aiValidEnabled: false,
                    aiDeviantEnabled: false,
                    koGruppeEnabled: true,
                    moduleEnabled: true,
                    modulOrgEnabled: false,
                    identnummerEnabled: false,
                    commEnabled: false,
                    stuckAuslosungEnabled: true,
                    aiDeviantValueState: "None",
                    moduleValueState: "None",
                    modulOrgValueState: "None",
                    stuckAuslosungValueState: "None"
                };
            
                var aStep11Data = oModel.getProperty("/step11Data") || [];
                aStep11Data.push(initialRow); // Add at the end of the array
                oModel.setProperty("/step11Data", aStep11Data);
            
                // Enable inputs and buttons for all rows
                oModel.setProperty("/showInputs", true);
                oModel.setProperty("/showButtons", true);
            
                // Determine the index of the newly added row
                var newIndex = aStep11Data.length - 1;
            
                // Enable/disable inputs based on partNumber validity for each row
                oModel.setProperty("/step11Data/" + newIndex + "/partNumberEnabled", true);
                oModel.setProperty("/step11Data/" + newIndex + "/additionalPartNumberEnabled", false);
                oModel.setProperty("/step11Data/" + newIndex + "/aiValidEnabled", false);
                oModel.setProperty("/step11Data/" + newIndex + "/aiDeviantEnabled", false);
                oModel.setProperty("/step11Data/" + newIndex + "/koGruppeEnabled", false);
                oModel.setProperty("/step11Data/" + newIndex + "/moduleEnabled", false);
                oModel.setProperty("/step11Data/" + newIndex + "/modulOrgEnabled", false);
                oModel.setProperty("/step11Data/" + newIndex + "/identnummerEnabled", false);
                oModel.setProperty("/step11Data/" + newIndex + "/commEnabled", false);
                oModel.setProperty("/step11Data/" + newIndex + "/stuckAuslosungEnabled", false);
            },


            onLiveChangePartNumber: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();

                // Validate partNumber format
                var bValid = /^\d{0,7}$/.test(sValue); // Allow up to 7 digits

                if (!bValid) {
                    oInput.setValueState("Error");
                } else {
                    oInput.setValueState("None");
                }

                // Update model property for partNumber
                var oModel = this.getView().getModel("applicationModel");
                if (oModel) {
                    oModel.setProperty("/partNumber", sValue);
                    oModel.setProperty("/partNumberValid", bValid);
                }
            },

            // Refresh button press handler
            onRefreshButtonPress: function () {
                var oModel = this.getView().getModel("applicationModel");
                if (!oModel) {
                    return;
                }

                var sPartNumber = oModel.getProperty("/partNumber");


                // Fetch corresponding data from PartNrSet based on the entered part number
                var aPartNrSetId = oModel.getProperty("/PartNrSet") || [];
                var oMatchingPart = aPartNrSetId.find(function (item) {
                    return item.PartNr === sPartNumber;
                });

                // Update corresponding fields in the table's current row (assuming single selection)
                var aStep11Data = oModel.getProperty("/step11Data") || [];
                var oSelectedRow = aStep11Data.find(function (row) {
                    return row.partNumber === sPartNumber; // Assuming partNumber field matches PartNr
                });

                if (oSelectedRow && oMatchingPart) {
                    // Update the fields in the current row with matching data
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/additionalPartNumber", oMatchingPart.Description);
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/aiValid", oMatchingPart.AI);
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/aiDeviant", ""); // Set to corresponding data from PartNrSet
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/koGruppe", oMatchingPart.Kogroup);
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/module", ""); // Set to corresponding data from PartNrSet
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/modulOrg", ""); // Set to corresponding data from PartNrSet
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/identnummer", ""); // Set to corresponding data from PartNrSet
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/comm", ""); // Set to corresponding data from PartNrSet
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/stuckAuslosung", ""); // Set to corresponding data from PartNrSet

                    // Enable the fields in the current row
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/additionalPartNumberEnabled", true);
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/aiValidEnabled", false);
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/aiDeviantEnabled", true);
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/koGruppeEnabled", true);
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/moduleEnabled", true);
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/modulOrgEnabled", true);
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/identnummerEnabled", true);
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/commEnabled", true);
                    oModel.setProperty("/step11Data/" + aStep11Data.indexOf(oSelectedRow) + "/stuckAuslosungEnabled", true);
                    // Enabling the two bottom buttons
                    oModel.setProperty("/enableSaveButton", true);
                    oModel.setProperty("/enableUserCheckButton", true);
                } else {
                    // Clear and disable all fields except the first input
                    aStep11Data.forEach(function (row) {
                        if (row == oSelectedRow) {
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/partNumber", ""); // Clear partNumber field
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/additionalPartNumber", "");
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/aiValid", "");
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/aiDeviant", "");
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/koGruppe", "");
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/module", "");
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/modulOrg", "");
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/identnummer", "");
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/comm", "");
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/stuckAuslosung", "");

                            // Disable all fields except the first input
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/additionalPartNumberEnabled", false);
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/aiValidEnabled", false);
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/aiDeviantEnabled", false);
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/koGruppeEnabled", false);
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/moduleEnabled", false);
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/modulOrgEnabled", false);
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/identnummerEnabled", false);
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/commEnabled", false);
                            oModel.setProperty("/step11Data/" + aStep11Data.indexOf(row) + "/stuckAuslosungEnabled", false);
                        }
                    });

                    // Show message box that PartNumber does not exist
                    sap.m.MessageBox.error("The given PartNumber does not exist!", {
                        title: "PartNumber Not Found",
                        actions: [sap.m.MessageBox.Action.OK]
                    });
                }
            },
            onInputChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue().trim();

                // Validate partNumber format
                var bValid = /^\d{0,7}$/.test(sValue); // Allow up to 7 digits

                if (!bValid) {
                    oInput.setValueState("Error");
                } else {
                    oInput.setValueState("None");
                }

                // Update model property for partNumber
                var oModel = this.getView().getModel("applicationModel");
                if (oModel) {
                    oModel.setProperty("/partNumber", sValue);
                    oModel.setProperty("/partNumberValid", bValid);
                }
            },

            // Function to validate partNumber
            onAiDeviantChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sNewValue = oInput.getValue().trim(); // Trim any leading or trailing spaces

                // Validate if sNewValue is a valid number
                var nNewValue = parseInt(sNewValue, 10);
                if (isNaN(nNewValue)) {
                    // Handle invalid input
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Invalid input. Please enter a valid number.");
                    return;
                }

                // Get aiValid value from model
                var oModel = this.getView().getModel("applicationModel");
                var sAiValid = oModel.getProperty("/aiValid");
                var nAiValid = parseInt(sAiValid, 10); // Convert aiValid to integer

                // Handle different lengths of sNewValue
                var trimmedValue;
                if (sNewValue.length > 2) {
                    // If more than two digits, trim to first two digits
                    trimmedValue = parseInt(sNewValue.substring(0, 2), 10);
                } else if (sNewValue.length === 2) {
                    // If exactly two digits, use as is
                    trimmedValue = parseInt(sNewValue, 10);
                } else if (sNewValue.length === 1) {
                    // If one digit, pad with '0' and use as is
                    trimmedValue = parseInt(sNewValue.padStart(2, '0'), 10);
                }

                // Compare trimmedValue with nAiValid
                if (trimmedValue > nAiValid) {
                    // Adjust the value to trim the first digit and add '0' in front
                    var adjustedValue = parseInt(trimmedValue.toString().substring(1), 10).toString().padStart(2, '0');
                    oInput.setValue(adjustedValue);
                } else {
                    // Valid input, set the value and remove error state
                    oInput.setValue(trimmedValue.toString().padStart(2, '0'));
                }

                // Remove error state and text
                oInput.setValueState("None");
                oInput.setValueStateText("");

                // Update the model with the validated value
                oModel.setProperty("/aiDeviant", oInput.getValue());
            },

            onDeleteRow: function (oEvent) {
                var that = this; // Save reference to the controller

                // Get the ColumnListItem that contains the delete button
                var oButton = oEvent.getSource();
                var oColumnListItem = oButton.getParent();

                // Get the index of the ColumnListItem
                var oTable = this.getView().byId("tableWizzardStep11");
                var iIndex = oTable.indexOfItem(oColumnListItem); // Index of the item in the table

                // Show confirmation dialog
                sap.m.MessageBox.warning(
                    "Are you sure you want to delete this field?", // Confirmation text
                    {
                        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], // Buttons to show
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.YES) {
                                // Proceed with deletion if "Yes" is clicked
                                that._deleteRowOpt3(iIndex);
                            }
                            // If "No" is clicked, do nothing
                        }
                    }
                );
            },
            onPressSave: function () {
                var oModel = this.getView().getModel("applicationModel");
                var aStep11Data = oModel.getProperty("/step11Data");
            
                var allValid = true;
            
                // Validate each row in the table
                aStep11Data.forEach(function (row, index) {
                    if (!this._validatePartNumber(row.partNumber) || 
                        !this._validateAdditionalPartNumber(row.additionalPartNumber) || 
                        !this._validateStuckAuslosung(row.stuckAuslosung)) {
            
                        allValid = false;
            
                        if (!this._validateStuckAuslosung(row.stuckAuslosung)) {
                            oModel.setProperty("/step11Data/" + index + "/stuckAuslosung", "");
                        }
            
                        return; // Exit early if validation fails
                    }
                }, this);
            
                if (allValid) {
                    sap.m.MessageBox.success("Data successfully sent to backend.", {
                        title: "Success",
                        onClose: function () {
                            // Trigger a page refresh
                            window.location.reload();
                        }
                    });
            
                    this._disableInputsInTable();
                } else {
                    sap.m.MessageBox.error("Please enter correct values for all fields.", {
                        title: "Error"
                    });
                }
            },
            _disableInputsInTable: function () {
                var oModel = this.getView().getModel("applicationModel");
                var aStep11Data = oModel.getProperty("/step11Data");
            
                aStep11Data.forEach(function (row, index) {
                    oModel.setProperty("/step11Data/" + index + "/partNumberEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/additionalPartNumberEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/aiValidEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/aiDeviantEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/koGruppeEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/moduleEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/modulOrgEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/identnummerEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/commEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/stuckAuslosungEnabled", false);
                });
            },

            onPressSaveOption3: function () {
                var oModel = this.getView().getModel("applicationModel");
                var aStep28Data = oModel.getProperty("/step28Data");
            
                var allValid = true;
            
                // Validate each row in the table
                aStep28Data.forEach(function (row, index) {
                    if (!this._validatePartNumber(row.partNumber) || 
                        !this._validateAdditionalPartNumber(row.additionalPartNumber) || 
                        !this._validateStuckAuslosung(row.stuckAuslosung)) {
            
                        allValid = false;
            
                        if (!this._validateStuckAuslosung(row.stuckAuslosung)) {
                            oModel.setProperty("/step28Data/" + index + "/stuckAuslosung", "");
                        }
            
                        // Return early if validation fails
                        return;
                    }
                }, this);
            
                if (allValid) {
                    sap.m.MessageBox.success("Data successfully sent to backend.", {
                        title: "Success",
                        onClose: function () {
                            // Trigger a page refresh
                            window.location.reload();
                        }
                    });
            
                    this._disableInputsInTable3();
                } else {
                    sap.m.MessageBox.error("Please enter correct values for all fields.", {
                        title: "Error"
                    });
                }
            },
            _disableInputsInTable3: function () {
                var oModel = this.getView().getModel("applicationModel");
                var aStep28Data = oModel.getProperty("/step28Data");
            
                aStep28Data.forEach(function (row, index) {
                    oModel.setProperty("/step28Data/" + index + "/partNumberEnabledOpt3", false);
                    oModel.setProperty("/step28Data/" + index + "/additionalPartNumberEnabledOpt3", false);
                    oModel.setProperty("/step28Data/" + index + "/aiValidEnabledOpt3", false);
                    oModel.setProperty("/step28Data/" + index + "/aiDeviantEnabledOpt3", false);
                    oModel.setProperty("/step28Data/" + index + "/koGruppeEnabledOpt3", false);
                    oModel.setProperty("/step28Data/" + index + "/kiefvagEnabledOpt3", false);
                    oModel.setProperty("/step28Data/" + index + "/modulOrgEnabledOpt3", false);
                    oModel.setProperty("/step28Data/" + index + "/wahrungEnabledOpt3", false);
                    oModel.setProperty("/step28Data/" + index + "/stuckAuslosungEnabledOpt3", false);
                });
            },
            _validateStuckAuslosung: function (value) {
                // Check if the value contains only digits
                return /^\d*$/.test(value);
            },

            // Helper function to validate partNumber
            _validatePartNumber: function (partNumber) {
                // Implement your validation logic for partNumber here
                // Example: Check if partNumber is not empty and meets your criteria
                return (partNumber && partNumber.trim().length > 0);
            },

            // Helper function to validate additionalPartNumber
            _validateAdditionalPartNumber: function (additionalPartNumber) {
                // Implement your validation logic for additionalPartNumber here
                // Example: Check if additionalPartNumber is not empty and meets your criteria
                return (additionalPartNumber && additionalPartNumber.trim().length > 0);
            },
            // User SAVE function 
            onPressUserCheck: function () {
                var oModel = this.getView().getModel("applicationModel");
                var aStep11Data = oModel.getProperty("/step11Data");
                var allValid = true;
            
                // Iterate through each row in the table data
                aStep11Data.forEach(function (row, index) {
                    // Validate partNumber (mandatory field)
                    if (!row.partNumber || row.partNumber.trim() === "") {
                        allValid = false;
                        oModel.setProperty("/step11Data/" + index + "/partNumber", "");
                        this._setInputErrorState("inputPartId", index, "partNumber");
                    }
            
                    // Validate aiDeviant (mandatory field)
                    if (!row.aiDeviant || row.aiDeviant.trim() === "") {
                        allValid = false;
                        oModel.setProperty("/step11Data/" + index + "/aiDeviant", "");
                        this._setInputErrorState("input311", index, "aiDeviant");
                    }
            
                    // Validate module (mandatory field)
                    if (!row.module || row.module.trim() === "") {
                        allValid = false;
                        oModel.setProperty("/step11Data/" + index + "/module", "");
                        this._setInputErrorState("input511", index, "module");
                    }
            
                    // Validate modulOrg (mandatory field)
                    if (!row.modulOrg || row.modulOrg.trim() === "") {
                        allValid = false;
                        oModel.setProperty("/step11Data/" + index + "/modulOrg", "");
                        this._setInputErrorState("input611", index, "modulOrg");
                    }
            
                    // Validate stuckAuslosung (mandatory field)
                    if (!row.stuckAuslosung || row.stuckAuslosung.trim() === "") {
                        allValid = false;
                        oModel.setProperty("/step11Data/" + index + "/stuckAuslosung", "");
                        this._setInputErrorState("input911", index, "stuckAuslosung");
                    }
                }, this);
            
                if (allValid) {
                    sap.m.MessageBox.success("All mandatory fields are filled out correctly.", {
                        title: "Success",
                        onClose: function () {
                            // Trigger a page refresh or navigate to another view
                            window.location.reload(); // Replace with your navigation logic if needed
                        }
                    });
            
                    this._disableInputsInTable();
                } else {
                    sap.m.MessageBox.error("Please enter correct values for all mandatory fields.", {
                        title: "Error"
                    });
                }
            },
            
            _disableInputsInTable: function () {
                var oModel = this.getView().getModel("applicationModel");
                var aStep11Data = oModel.getProperty("/step11Data");
            
                aStep11Data.forEach(function (row, index) {
                    oModel.setProperty("/step11Data/" + index + "/partNumberEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/additionalPartNumberEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/aiValidEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/aiDeviantEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/koGruppeEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/moduleEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/modulOrgEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/identnummerEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/commEnabled", false);
                    oModel.setProperty("/step11Data/" + index + "/stuckAuslosungEnabled", false);
                });
            },
            
            _setInputErrorState: function (sInputId, iIndex, sProperty) {
                var oView = this.getView();
                var oInput = oView.byId(sInputId);
                if (oInput) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("This field is mandatory");
                }
            },
            
            _setInputErrorState: function (sInputId, iIndex, sProperty) {
                var oView = this.getView();
                var oInput = oView.byId(sInputId);
                if (oInput) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("This field is mandatory");
                }
            },

            onActivateStep11: function () {
                var oModel = this.getView().getModel("applicationModel");

                // Disable the buttons
                oModel.setProperty("/enableSaveButton", false);
                oModel.setProperty("/enableUserCheckButton", false);
                // Other logic as needed
                oModel.setProperty("/Wizard/showInputs", false);
                oModel.setProperty("/Wizard/showButtons", false);


            },
            // Stuck change function 
            onStuckChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oEvent.getParameter("newValue");
            
                // Check if the value contains only digits
                var isValidNumber = /^\d+$/.test(sValue);
            
                if (!isValidNumber) {
                    // Set the input field to indicate invalid value
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                    oInput.setValueStateText("Please enter only digits.");
                } else {
                    // Clear any error state if the value is valid
                    oInput.setValueState(sap.ui.core.ValueState.None);
                }
            },
            
            // Helper function to check if a value is a valid number
            _isValidNumber: function (sValue) {
                var fValue = parseFloat(sValue);
                return !isNaN(fValue) && isFinite(fValue);
            },
            // KO groupe change function 
            onKoGrouppeChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();

                // Define the pattern to match: 'K' followed by exactly 4 digits
                var regex = /^K\d{4}$/;

                if (regex.test(sValue)) {
                    // If the input matches the pattern, set value state to None (no error)
                    oInput.setValueState("None");
                    oInput.setValueStateText("");
                } else {
                    // If the input does not match the pattern, set value state to Error
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Invalid input. The format should be 'K' followed by exactly 4 digits.");
                    oInput.setValue("");
                }
            },
            // ---------------------------------------------------------------------CONTROLLER TILE2 WIZZARD OPTION 3------------------------------------------------------------------------------------------

            onPressNextStep1_3: function () {
                var oView = this.getView();

                // Disable tile2
                this.getView().byId("tile2").setState("Disabled");

                // Set value state to "None"
                var oModel = this.getView().getModel("applicationModel");
                oModel.setProperty("/Wizard/Step1_2TextValueValueState", "None");

                // Set value for TextArea
                this.getView().byId("inputStep_2_2").setValue("Langlaufer Werkzeugbestellung");
            },
            onPressNextStep2_2: function (oEvent) {
                var oModel = this.getView().getModel("applicationModel");
                var sInputValue = this.getView().byId("inputStep_2_2").getValue();
                oModel.setProperty("/Wizard/Step1_2TextValue", sInputValue);

                var aBauphaseSet = this.getView().getModel("applicationModel").getProperty("/Derivate_Baukasten_ProjectSet");
                this.getView().getModel("applicationModel").setProperty("/Step4Values", aBauphaseSet);


                this.getView().byId("inputStep_2_2").setEditable(false);
                var oInput = this.getView().byId("inputStep_2_2")
                oInput.setEnabled(false);
            },
            onLiveChangeInputStep2_2: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue().trim(); // Trim whitespace from the input value

                if (sValue) {
                    // Input is not empty
                    this.getView().byId("wizard").validateStep(this.getView().byId("wizard").getProgressStep());
                    oInput.setValueState("None"); // Clear any previous error state
                } else {
                    // Input is empty
                    this.getView().byId("wizard").getProgressStep().setValidated(false);
                    oInput.setValueState("Error"); // Set value state to Error
                }
            },
            onWizardStep2_2Activate: function (oEvent) {
                this.getView().byId("wizard").validateStep(this.getView().byId("wizard").getProgressStep());
            },
            onPressNextStep2_3: function (oEvent) {
                var aMTBBGVorserieSet = this.getView().getModel("applicationModel").getProperty("/MT_BBG_VorserieSet");

                // Determine the selected value from comboStep2_3
                var sSelectedValue = this.getView().byId("comboStep2_3").getSelectedKey();

                // Filter the data to include only MT or BBG based on user selection
                var aFilteredValues = aMTBBGVorserieSet.filter(function (item) {
                    return item.BBG === sSelectedValue || item.BBG === 'MT' || item.BBG === 'BBG';
                });

                // Set the filtered values into Step51Values in your model
                this.getView().getModel("applicationModel").setProperty("/Step51Values", aFilteredValues);

                // Disable the combo box and set its value
                var oComboBox = this.getView().byId("comboStep2_3");
                oComboBox.setEditable(false);
                oComboBox.setEnabled(false);
            },
            onPressNextStep2_4: function (oEvent) {

                this.getView().byId("comboStep1_4").setEditable(false);
                var oComboBox = this.getView().byId("comboStep1_4")
                oComboBox.setEnabled(false);
            },

            onActivateStep2_5: function (oEvent) {
                var oDatePicker = this.byId("datePickerStep5");
                var oToday = new Date();
                oToday.setDate(oToday.getDate() + 1); // Get tomorrow's date
                oDatePicker.setMinDate(oToday);
            },
            onPressNextStep2_5: function (oEvent) {
                var comboStep5 = this.byId("inputStep2_5");
                var datePickerStep5 = this.byId("datePickerStep5");

                if (datePickerStep5) {
                    datePickerStep5.setEnabled(false);
                }

                var oModel = this.getView().getModel("applicationModel");
                var step5TextValue = comboStep5.getValue();
                var step5DateValue = datePickerStep5.getValue();

                oModel.setProperty("/Wizard/Step5SelectedDeliveryDetails/SelectedText", step5TextValue);
                oModel.setProperty("/Wizard/Step5SelectedDeliveryDetails/SelectedDate", step5DateValue);

                this.getView().byId("datePickerStep5").setEditable(false);
                var oDatePicker = this.getView().byId("datePickerStep5")
                oDatePicker.setEnabled(false);
            },
            // DatePicker Step5 change function
            onDatePickerStep5Change: function (oEvent) {
                var oDatePicker = oEvent.getSource();
                var sValue = oDatePicker.getValue();

                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd/MM/yyyy" });
                var oDate = oDateFormat.parse(sValue);

                if (oDate) {
                    var sFormattedDate = oDateFormat.format(oDate);
                    oDatePicker.setValue(sFormattedDate);
                    var oModel = this.getView().getModel("applicationModel");
                    oModel.setProperty("/Wizard/Step5SelectedDeliveryDetails/SelectedDate", sFormattedDate);
                }

                this.checkCompletionAndNavigate5();
            },
            onDatePickerStep15Change: function (oEvent) {
                var oDatePicker = oEvent.getSource();
                var sValue = oDatePicker.getValue();

                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd/MM/yyyy" });
                var oDate = oDateFormat.parse(sValue);

                if (oDate) {
                    var sFormattedDate = oDateFormat.format(oDate);
                    oDatePicker.setValue(sFormattedDate);
                    var oModel = this.getView().getModel("applicationModel");
                    oModel.setProperty("/Wizard/Step15SelectedDate", sFormattedDate);
                }

                this.checkCompletionAndNavigate15();
            },
            onWizardStepActivate1_6: function () {
                var oDatePicker1 = this.byId("datePickerStep15");

                // Get today's date
                var oToday = new Date();

                // Calculate the date 28 days from today
                var oMinDate = new Date();
                oMinDate.setDate(oToday.getDate() + 28);

                // Set the minDate property
                oDatePicker1.setMinDate(oMinDate);
            },
            onWizardStepActivate1_8: function () {
                var oDatePicker = this.byId("datePickerStep18");

                // Get today's date
                var oToday = new Date();

                // Calculate the date 28 days from today
                var oMinDate = new Date();
                oMinDate.setDate(oToday.getDate() + 28);

                // Set the minDate property
                oDatePicker.setMinDate(oMinDate);
            },
            onDatePickerStep15Change: function (oEvent) {
                var oDatePicker = oEvent.getSource();
                var sValue = oDatePicker.getValue();

                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd/MM/yyyy" });
                var oDate = oDateFormat.parse(sValue);

                if (oDate) {
                    var sFormattedDate = oDateFormat.format(oDate);
                    oDatePicker.setValue(sFormattedDate);
                    var oModel = this.getView().getModel("applicationModel");
                    oModel.setProperty("/Wizard/Step15SelectedDate", sFormattedDate);
                }

                this.checkCompletionAndNavigate15();
            },
            checkCompletionAndNavigate5: function () {
                var oDatePicker = this.byId("datePickerStep5");
                var bDatePickerCompleted = oDatePicker.getValue() !== "" && oDatePicker.getValueState() !== "Error";

                if (bDatePickerCompleted) {
                    var oView = this.getView();
                    oView.byId("wizard").validateStep(oView.byId("wizard_2_5"));
                } else {
                    var oView = this.getView();
                    oView.byId("wizard").invalidateStep(oView.byId("wizard_2_5"));
                }
            },
            checkCompletionAndNavigate15: function () {
                var oDatePicker = this.byId("datePickerStep15");
                var bDatePickerCompleted15 = oDatePicker.getValue() !== "" && oDatePicker.getValueState() !== "Error";
                var oView = this.getView();
                var oWizard = oView.byId("wizard");

                if (bDatePickerCompleted15) {
                    oWizard.validateStep(oView.byId("wizard_1_6"));
                } else {
                    oWizard.invalidateStep(oView.byId("wizard_1_6"));
                }
            },
            onPressNextStep16: function (oEvent) {
                var oDatePicker = this.byId("datePickerStep15");
                oDatePicker.setEnabled(false);
            },
            // Button YES press function 
            onPressButtonYesStep51: function () {
                var oView = this.getView();
                oView.byId(this.createId("wizard")).invalidateStep(oView.byId(this.createId("wizard")).getProgressStep());
                var oModel = oView.getModel("applicationModel");

                // Clear filter values in the model
                oModel.setProperty("/QX", "");
                oModel.setProperty("/Lastname", "");
                oModel.setProperty("/Firstname", "");
                oModel.setProperty("/Department", "");
                oModel.setProperty("/Email", "");

                // Clear the FilterBar inputs
                var oFilterBar = this._getFilterBarWithUniqueId("fbAbgestimmtSearch51");
                if (oFilterBar) {
                    oFilterBar.fireClear();
                }

                // Deselect any selected items in the Table
                var oTable = oView.byId(this.createId("tableAbgestimmtStep51"));
                if (oTable) {
                    oTable.removeSelections();
                }

                // Perform any additional actions needed for Step 9
                oModel.setProperty("/bFirstPanelVisible", true);
                oModel.setProperty("/bSecondPanelVisible", true);
                oModel.setProperty("/bThirdPanelVisible", false);
                oModel.setProperty("/bRestartVisibility", true);

                var oPanel = oView.byId(this.createId("panelAbgetstimmt51"));
                if (oPanel) {
                    oPanel.setExpanded(true);
                }

                // Load or refresh data as needed
                var that = this;
                jQuery.getJSON("./model/data.json", function (data) {
                    // Update the model with new data if necessary
                    that._filterAbgestimmtDetails51(data.User_detailsSet);
                });

                // Set button states if applicable
                oView.byId(this.createId("BtnPressYes51")).setPressed(true);
                oView.byId(this.createId("BtnPressNo51")).setPressed(false);
            },
            // Button NO press function 
            onPressButtonNoStep51: function (oEvent) {
                var oModel = this.getView().getModel("applicationModel");

                var oView = this.getView();
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step51SelectedUser", "");
                oView.byId(this.createId("BtnPressYes51")).setPressed(false);
                oView.byId(this.createId("BtnPressNo51")).setPressed(true);

                if (oModel) {
                    oModel.setProperty("/bFirstPanelVisible", false);
                    oModel.setProperty("/bFirstPanelExpanded", false);
                }

                // Clear the FilterBar inputs
                var oFilterBar = this._getFilterBarWithUniqueId("fbAbgestimmtSearch51");
                if (oFilterBar) {
                    oFilterBar.fireClear();
                }

                // Deselect any selected items in the Table
                var oTable = oView.byId(this.createId("tableAbgestimmtStep51"));
                if (oTable) {
                    oTable.removeSelections();
                }



                oView.byId(this.createId("wizard")).validateStep(oView.byId(this.createId("wizard")).getProgressStep());
            },

            _getFilterBarWithUniqueId: function (sFragmentId) {
                var oView = this.getView();
                var sUniqueId = this.createId(sFragmentId);
                var oFilterBar = sap.ui.getCore().byId(sUniqueId);

                if (!oFilterBar) {
                    oFilterBar = sap.ui.xmlfragment({
                        fragmentName: "project1.view.fragments.AbgestimmtWizzardOption3",
                        id: sUniqueId,
                        type: "XML"
                    });

                    this._assignUniqueIds(oFilterBar, sUniqueId);
                    oView.addDependent(oFilterBar);
                }

                return oFilterBar;
            },
            // Assigning unique id function
            _assignUniqueIds: function (oFragment, sUniqueId) {
                var aElements = oFragment.findElements(true);
                aElements.forEach(function (oElement) {
                    var sOldId = oElement.getId();
                    var sNewId = sUniqueId + sOldId.substr(sOldId.lastIndexOf("--"));
                    oElement.setId(sNewId);
                });
            },
            // Abgestimmt selection press function
            onPressSearchAbgestimmtStep51: function () {
                var that = this;
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");
                var aData = oModel.getProperty("/User_detailsSet"); // Original dataset

                var oFilterBar = oView.byId("fbAbgestimmtSearch51");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                var sQX = "";
                var sLastname = "";
                var sFirstname = "";
                var sDepartment = "";
                var sEmail = "";

                aFilterItems.forEach(function (oFilterItem) {
                    var sItemName = oFilterItem.getName();
                    var oControl = oFilterItem.getControl();

                    switch (sItemName) {
                        case "QX":
                            sQX = oControl.getValue();
                            break;
                        case "Lastname":
                            sLastname = oControl.getValue();
                            break;
                        case "Firstname":
                            sFirstname = oControl.getValue();
                            break;
                        case "Department":
                            sDepartment = oControl.getValue();
                            break;
                        case "Email":
                            sEmail = oControl.getValue();
                            break;
                        default:
                            break;
                    }
                });

                // Perform filtering based on retrieved values
                var aFilteredData = aData.filter(function (item) {
                    return (!sQX || item.QX.includes(sQX)) &&
                        (!sLastname || item.Lastname.includes(sLastname)) &&
                        (!sFirstname || item.Firstname.includes(sFirstname)) &&
                        (!sDepartment || item.Department.includes(sDepartment)) &&
                        (!sEmail || item.Email.includes(sEmail));
                });

                oModel.setProperty("/AbgestimmtList51", aFilteredData); // Update table data

                // Destroy the fragment after use
                this._destroyAbgestimmtFragment51();
            },
            // Abgestimmt filterBar clearing function
            onPressClearSearchAbgestimmtStep51: function () {
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                var oFilterBar = oView.byId("fbAbgestimmtSearch51");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                    var oControl = oFilterItem.getControl();
                    if (oControl instanceof sap.m.Input) {
                        oControl.setValue("");
                    }
                });

                // Retrieve original dataset and update the model
                jQuery.getJSON("./model/data.json", function (data) {
                    oModel.setProperty("/AbgestimmtList51", data.User_detailsSet); // Update the data in the model
                });

                // Destroy the fragment after use
                this._destroyAbgestimmtFragment51();
            },
            // Abgestimmt selection press function
            onPressButtonNoStep51: function (oEvent) {
                var oModel = this.getView().getModel("applicationModel");
                var oView = this.getView();

                // Clear all properties of /Wizard/Step51SelectedUser
                var oStep51SelectedUser = oModel.getProperty("/Wizard/Step51SelectedUser");
                for (var property in oStep51SelectedUser) {
                    if (oStep51SelectedUser.hasOwnProperty(property)) {
                        oStep51SelectedUser[property] = ""; // or null, depending on your requirement
                    }
                }
                oModel.setProperty("/Wizard/Step51SelectedUser", oStep51SelectedUser);

                // Update button states
                oView.byId(this.createId("BtnPressYes51")).setPressed(false);
                oView.byId(this.createId("BtnPressNo51")).setPressed(true);

                if (oModel) {
                    oModel.setProperty("/bFirstPanelVisible", false);
                    oModel.setProperty("/bFirstPanelExpanded", false);
                }

                // Clear the FilterBar inputs
                var oFilterBar = this._getFilterBarWithUniqueId("fbAbgestimmtSearch51");
                if (oFilterBar) {
                    oFilterBar.fireClear();
                }

                // Deselect any selected items in the Table
                var oTable = oView.byId(this.createId("tableAbgestimmtStep51"));
                if (oTable) {
                    oTable.removeSelections();
                }

                // Validate the current step of the wizard
                oView.byId(this.createId("wizard")).validateStep(oView.byId(this.createId("wizard")).getProgressStep());
            },
            // Filtering Abgestimmt function
            _filterAbgestimmtDetails51: function (aUserDetails) {
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Retrieve filters from FilterBar
                var aFilters = [];
                var oFilterBar = oView.byId("fbAbgestimmtSearch51");
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                    var sValue = oFilterItem.getControl().getValue();
                    if (sValue) {
                        aFilters.push({
                            path: oFilterItem.getName(),
                            value: sValue.toLowerCase()  // Convert value to lowercase for case-insensitive comparison
                        });
                    }
                });

                // Filter the provided user details based on filter values
                var aFilteredUsers = aUserDetails.filter(function (oUser) {
                    return aFilters.every(function (oFilter) {
                        return oUser[oFilter.path].toLowerCase().includes(oFilter.value);
                    });
                });

                // Update the model with filtered items
                oModel.setProperty("/AbgestimmtList51", aFilteredUsers);
            },
            _loadAbgestimmtFragment51: function () {
                var oView = this.getView();
                var sFragmentId = "abgestimmtFragment51"; // Ensure unique ID for the fragment
                var oFragment = sap.ui.xmlfragment(sFragmentId, "project1.view.fragments.AbgestimmtWizzardOption3", this);

                oView.addDependent(oFragment);

                return oFragment;
            },
            // Fragment deletion
            _destroyAbgestimmtFragment51: function () {
                var oView = this.getView();
                var sFragmentId = "abgestimmtFragment51"; // Ensure this matches the fragment ID used in _loadAbgestimmtFragment51

                var oFragment = oView.byId(sFragmentId);
                if (oFragment) {
                    oView.removeDependent(oFragment);
                    oFragment.destroy();
                }
            },
            onPressNextStep2_6: function () {
                var oView = this.getView();
                var oButtontYes = this.getView().byId("BtnPressYes51");
                var oButtonNo = this.getView().byId("BtnPressNo51");
                oButtontYes.setEnabled(false);
                oButtonNo.setEnabled(false);
                oView.byId("panelAbgetstimmt51").setVisible(false);
                oView.byId("scAbgestimmtStep51").setVisible(false);
                oView.byId("tableAbgestimmtStep51").setVisible(false);

            },
            // Summary validation button press
            btnCreatePW5: function () {
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");
                var form = oView.byId("formSummary5");
                var formContent = form.getContent();
                var allFieldsValid = true;
            
                formContent.forEach(function (field) {
                    if (field instanceof sap.m.Input || field instanceof sap.m.ComboBox || field instanceof sap.m.DatePicker || field instanceof sap.m.TextArea) {
                        if (field.getRequired && field.getRequired()) {
                            if (!field.getValue()) {
                                field.setValueState(sap.ui.core.ValueState.Error);
                                allFieldsValid = false;
                            } else {
                                field.setValueState(sap.ui.core.ValueState.None);
                            }
                        }
                    }
                });
            
                if (allFieldsValid) {
                    // Disable all fields after successful validation and processing
                    formContent.forEach(function (field) {
                        if (field.setEditable) {
                            field.setEditable(false);
                        }
                        if (field.setEnabled) {
                            field.setEnabled(false);
                        }
                    });
            
                    // Show success message
                    sap.m.MessageBox.success("All fields are valid. Proceeding with further actions.", {
                        title: "Success",
                        onClose: function () {
                            // Validate the wizard step
                            oView.byId("wizard").validateStep(oView.byId("wizard_2_7"));
            
                            // Disable the PW erstellen button
                            var oBtnCreatePW5 = oView.byId("btnCreatePW5");
                            if (oBtnCreatePW5) {
                                oBtnCreatePW5.setEnabled(false);
                            }
                        }
                    });
                } else {
                    sap.m.MessageBox.warning("Please fill in all required fields correctly.", {
                        title: "Warning"
                    });
                }
            },
            // ---------------------------------------------------------------------CONTROLLER TILE1 WIZZARD OPTION 2------------------------------------------------------------------------------------------
            // YES buton handle press
            onPressButtonYesStep21: function () {
                // Show the HBox
                this.byId("hboxStep21").setVisible(true);

                // Set the "Yes" button as pressed and "No" button as unpressed
                this.byId("BtnPressYes21").setPressed(true);
                this.byId("BtnPressNo21").setPressed(false);

                // Invalidate the current step
                var oView = this.getView();
                oView.byId(this.createId("wizard")).invalidateStep(oView.byId(this.createId("wizard")).getProgressStep());
            },

            onPressButtonNoStep21: function () {
                // Hide the HBox
                this.byId("hboxStep21").setVisible(false);

                // Set the "No" button as pressed and "Yes" button as unpressed
                this.byId("BtnPressYes21").setPressed(false);
                this.byId("BtnPressNo21").setPressed(true);

                // Get the wizard and current step
                var oWizard = this.byId("wizard");
                var oCurrentStep = this.byId("wizard_1_2");
                var oNextStep = this.byId("wizard_1_2_1"); // Define the next step for "No"

                // Set the next step dynamically
                oCurrentStep.setNextStep(oNextStep);

                // Validate the current step and trigger next step
                oCurrentStep.fireComplete();
                oWizard.nextStep();
                var oView = this.getView();
                // Optionally validate the next step
                // oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
            },
            onPressNextStep1_2: function () {
                var oView = this.getView();
                var oButtontYes = this.getView().byId("BtnPressYes21");
                var oButtonNo = this.getView().byId("BtnPressNo21");
                oButtontYes.setEnabled(false);
                oButtonNo.setEnabled(false);

                var oVbox121 = this.getView().byId("hboxStep121");
                // oVbox121.setEnabled(false);
            },
            // LiveChange validation function for PP-Number
            onLiveChangePartNumber21: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var bValid = /^PP000\d{5}$/.test(sValue);
                var oModel = this.getView().getModel("applicationModel");

                // Update partNumber in the model
                oModel.setProperty("/partNumber", sValue);
                oModel.setProperty("/partNumberValid", bValid);

                // Enable/disable refresh button based on validity
                this.getView().byId("refreshButtonStep21").setEnabled(bValid);

                // Update the Wizard Step title
                this.updateWizardStepTitle();
            },
            formatWizardStepTitle: function (partNumber) {
                var i18nModel = this.getView().getModel("i18n");
                var baseTitle = i18nModel.getResourceBundle().getText("text.wizard2.step7"); // Static text from i18n model
                return partNumber ? baseTitle + " " + partNumber : baseTitle;
            },
            updateWizardStepTitle: function () {
                var oView = this.getView();
                var oWizardStep = oView.byId("wizard_1_8");
                var oModel = oView.getModel("applicationModel");
                var sPartNumber = oModel.getProperty("/partNumber");
                var sTitle = this.formatWizardStepTitle(sPartNumber);

                // Set the title
                oWizardStep.setTitle(sTitle);
            },
            onWizardStepActivate1_8: function (oEvent) {
                this.updateWizardStepTitle();
            },
            // Refresh handle function
            onRefreshButtonPress21: function () {
                var oModel = this.getView().getModel("applicationModel");
                var bPartNumberValid = oModel.getProperty("/partNumberValid");

                if (bPartNumberValid) {
                    // Navigate to the next step if validation passes
                    var oView = this.getView();
                    oView.byId(this.createId("wizard")).validateStep(oView.byId(this.createId("wizard")).getProgressStep());
                } else {
                    MessageBox.error("Part number is invalid or data not found.");
                }
            },
            //Adding Selection Row function
            onPressPlusStep28: function () {
                var oModel = this.getView().getModel("applicationModel");

                // Add a new row with initial values
                var initialRow = {
                    partNumber: "",
                    additionalPartNumber: "",
                    aiValid: "",
                    aiDeviant: "",
                    koGruppe: "",
                    kiefvag: "",
                    stuckAuslosung: "",
                    modulOrg: "",
                    wahrung: "",
                    partNumberEnabled: true,
                    additionalPartNumberEnabled: false,
                    aiValidEnabled: false,
                    aiDeviantEnabled: false,
                    koGruppeEnabled: false,
                    moduleEnabled: false,
                    KIEVFAGEnabled: false,
                    stuckAuslosungEnabled: false,
                    modulOrgEnabled: false,
                    wahrungEnabled: false
                };

                var aStep28Data = oModel.getProperty("/step28Data") || [];
                aStep28Data.push(initialRow); // Add at the end of the array
                oModel.setProperty("/step28Data", aStep28Data);

                // Enable inputs and buttons for all rows
                oModel.setProperty("/showInputs28", true);
                oModel.setProperty("/showButtons28", true);

                // Determine the index of the newly added row
                var newIndex = aStep28Data.length - 1;

                // Enable/disable inputs based on partNumber validity for each row
                oModel.setProperty("/step28Data/" + newIndex + "/partNumberEnabled", true);
                oModel.setProperty("/step28Data/" + newIndex + "/additionalPartNumberEnabled", false);
                oModel.setProperty("/step28Data/" + newIndex + "/aiValidEnabled", false);
                oModel.setProperty("/step28Data/" + newIndex + "/aiDeviantEnabled", false);
                oModel.setProperty("/step28Data/" + newIndex + "/koGruppeEnabled", false);
                oModel.setProperty("/step28Data/" + newIndex + "/kiefvagEnabled", false);
                oModel.setProperty("/step28Data/" + newIndex + "/stuckAuslosungEnabled", false);
                oModel.setProperty("/step28Data/" + newIndex + "/modulOrgEnabled", false);
                oModel.setProperty("/step28Data/" + newIndex + "/wahrungEnabled", false);
            },
            // Selection Row deletion function
            onDeleteRowOption3: function (oEvent) {
                var that = this; // Save reference to the controller

                // Get the ColumnListItem that contains the delete button
                var oButton = oEvent.getSource();
                var oColumnListItem = oButton.getParent();

                // Get the index of the ColumnListItem
                var oTable = this.getView().byId("tableWizzardStep28");
                var iIndex = oTable.indexOfItem(oColumnListItem); // Index of the item in the table

                // Show confirmation dialog
                sap.m.MessageBox.warning(
                    "Are you sure you want to delete this field?", // Confirmation text
                    {
                        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], // Buttons to show
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.YES) {
                                // Proceed with deletion if "Yes" is clicked
                                that._deleteRow(iIndex);
                            }
                            // If "No" is clicked, do nothing
                        }
                    }
                );
            },

            // Function to handle the actual deletion
            _deleteRow: function (iIndex) {
                var oModel = this.getView().getModel("applicationModel");
                if (!oModel) {
                    return;
                }

                // Get the array from the model
                var aStep28Data = oModel.getProperty("/step28Data");

                // Remove the item at the given index
                if (iIndex >= 0 && iIndex < aStep28Data.length) {
                    aStep28Data.splice(iIndex, 1);
                    oModel.setProperty("/step28Data", aStep28Data);

                    // Determine if there are any remaining items in the table
                    var bShowTable = aStep28Data.length > 0;

                    // Update the model properties to reflect the state
                    oModel.setProperty("/showTable", bShowTable);

                    // If no more rows exist, reset input enablement
                    if (aStep28Data.length === 0) {
                        // Reset other properties as needed
                        oModel.setProperty("/partNumberEnabled", true);
                        oModel.setProperty("/additionalPartNumberEnabled", false);
                        oModel.setProperty("/aiValidEnabled", false);
                        oModel.setProperty("/aiDeviantEnabled", false);
                        oModel.setProperty("/koGruppeEnabled", true);
                        oModel.setProperty("/moduleEnabled", true);
                        oModel.setProperty("/modulOrgEnabled", false);
                        oModel.setProperty("/wahrungEnabled", false);
                        oModel.setProperty("/identnummerEnabled", false);
                        oModel.setProperty("/commEnabled", false);
                        oModel.setProperty("/stuckAuslosungEnabled", false);
                        oModel.setProperty("/enableSaveButton", false);
                        oModel.setProperty("/enableUserCheckButton", false);

                        oModel.setProperty("/enableSaveButtonOption3", false);
                        oModel.setProperty("/enableUserCheckButtonOption3", false);
                    }
                }
            },
            _deleteRowOpt3: function (iIndex) {
                var oModel = this.getView().getModel("applicationModel");
                if (!oModel) {
                    return;
                }
            
                // Get the array from the model
                var aStep11Data = oModel.getProperty("/step11Data");
            
                // Remove the item at the given index
                if (iIndex >= 0 && iIndex < aStep11Data.length) {
                    aStep11Data.splice(iIndex, 1);
                    oModel.setProperty("/step11Data", aStep11Data);
            
                    // Determine if there are any remaining items in the table
                    var bShowInputs = aStep11Data.length > 0;
            
                    // Update the model properties to reflect the state
                    oModel.setProperty("/showInputs", bShowInputs);
            
                    // If no more rows exist, reset input enablement
                    if (aStep11Data.length === 0) {
                        // Reset other properties as needed
                        oModel.setProperty("/partNumberEnabled", true);
                        oModel.setProperty("/additionalPartNumberEnabled", false);
                        oModel.setProperty("/aiValidEnabled", false);
                        oModel.setProperty("/aiDeviantEnabled", false);
                        oModel.setProperty("/koGruppeEnabled", true);
                        oModel.setProperty("/moduleEnabled", true);
                        oModel.setProperty("/modulOrgEnabled", false);
                        oModel.setProperty("/identnummerEnabled", false);
                        oModel.setProperty("/commEnabled", false);
                        oModel.setProperty("/stuckAuslosungEnabled", false);
            
                        // Disable the buttons since no rows exist
                        oModel.setProperty("/enableSaveButton", false);
                        oModel.setProperty("/enableUserCheckButton", false);
                    }
                }
            },
            onWizardStepActivate1_3: function () {
                var oView = this.getView();
                oView.byId(this.createId("wizard")).validateStep(oView.byId(this.createId("wizard")).getProgressStep());
            },

            onExit: function () {
                // Detach the global click event handler to avoid memory leaks
                jQuery(document).off("click", this.onDocumentClick.bind(this));
            },

            // onDocumentClick: function (oEvent) {
            //     var oView = this.getView();
            //     var oTable = oView.byId("tableWizzardStep28");

            //     // Check if the click target is outside the table
            //     if (!oTable.getDomRef().contains(oEvent.target)) {
            //         this.onRefreshButtonPress28();
            //     }
            // },
            // Data Fetching after Refresh on PP-Number
            onRefreshButtonPress28: function () {
                var that = this; // Save reference to the controller
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                if (!oModel) {
                    return;
                }

                var sPartNumber = oModel.getProperty("/partNumber");
                var aPartNrSet = oModel.getProperty("/PartNrSet") || [];
                var oMatchingPart = aPartNrSet.find(function (item) {
                    return item.PartNr === sPartNumber;
                });

                var oTable = oView.byId("tableWizzardStep28");
                var aStep28Data = oModel.getProperty("/step28Data") || [];

                var bPartFound = false; // Flag to track if part number is found

                oTable.getItems().forEach(function (oItem) {
                    var oBindingContext = oItem.getBindingContext("applicationModel");
                    var oRowData = oBindingContext.getProperty();

                    if (oRowData.partNumber === sPartNumber) {
                        bPartFound = true; // Set flag to true if part number is found

                        if (oMatchingPart) {
                            oModel.setProperty(oBindingContext.getPath() + "/additionalPartNumber", oMatchingPart.Description);
                            oModel.setProperty(oBindingContext.getPath() + "/aiValid", oMatchingPart.AI);
                            oModel.setProperty(oBindingContext.getPath() + "/aiDeviant", ""); // Set to corresponding data from PartNrSet
                            oModel.setProperty(oBindingContext.getPath() + "/koGruppe", oMatchingPart.Kogroup);
                            oModel.setProperty(oBindingContext.getPath() + "/KIEVFAG", oMatchingPart.Kievfag); // Set to corresponding data from PartNrSet
                            oModel.setProperty(oBindingContext.getPath() + "/modulOrg", ""); // Set to corresponding data from PartNrSet
                            oModel.setProperty(oBindingContext.getPath() + "/identnummer", ""); // Set to corresponding data from PartNrSet
                            oModel.setProperty(oBindingContext.getPath() + "/comm", ""); // Set to corresponding data from PartNrSet
                            oModel.setProperty(oBindingContext.getPath() + "/stuckAuslosung", 1); // Prefill with 1
                            oModel.setProperty(oBindingContext.getPath() + "/wahrung", "EUR"); // Prefill with "EUR" (ensure it's just the abbreviation)

                            oModel.setProperty(oBindingContext.getPath() + "/additionalPartNumberEnabled", true);
                            oModel.setProperty(oBindingContext.getPath() + "/aiValidEnabled", false);
                            oModel.setProperty(oBindingContext.getPath() + "/aiDeviantEnabled", true);
                            oModel.setProperty(oBindingContext.getPath() + "/koGruppeEnabled", false); // Make koGruppe uneditable
                            oModel.setProperty(oBindingContext.getPath() + "/kiefvagEnabled", true);
                            oModel.setProperty(oBindingContext.getPath() + "/modulOrgEnabled", true);
                            oModel.setProperty(oBindingContext.getPath() + "/identnummerEnabled", true);
                            oModel.setProperty(oBindingContext.getPath() + "/commEnabled", true);
                            oModel.setProperty(oBindingContext.getPath() + "/stuckAuslosungEnabled", true);
                            oModel.setProperty(oBindingContext.getPath() + "/wahrungEnabled", true); // Enable this field

                            // Set visible the Save and UserCheck buttons
                            oModel.setProperty("/enableSaveButtonOption3", true);
                            oModel.setProperty("/enableUserCheckButtonOption3", true);
                        } else {
                            // Clear fields if part number is not found
                            oModel.setProperty(oBindingContext.getPath() + "/additionalPartNumber", "");
                            oModel.setProperty(oBindingContext.getPath() + "/aiValid", "");
                            oModel.setProperty(oBindingContext.getPath() + "/aiDeviant", "");
                            oModel.setProperty(oBindingContext.getPath() + "/koGruppe", "");
                            oModel.setProperty(oBindingContext.getPath() + "/kiefvag", "");
                            oModel.setProperty(oBindingContext.getPath() + "/modulOrg", "");
                            oModel.setProperty(oBindingContext.getPath() + "/stuckAuslosung", "");
                            oModel.setProperty(oBindingContext.getPath() + "/wahrung", "");

                            oModel.setProperty(oBindingContext.getPath() + "/additionalPartNumberEnabled", false);
                            oModel.setProperty(oBindingContext.getPath() + "/aiValidEnabled", false);
                            oModel.setProperty(oBindingContext.getPath() + "/aiDeviantEnabled", false);
                            oModel.setProperty(oBindingContext.getPath() + "/koGruppeEnabled", false);
                            oModel.setProperty(oBindingContext.getPath() + "/kiefvagEnabled", false);
                            oModel.setProperty(oBindingContext.getPath() + "/modulOrgEnabled", false);
                            oModel.setProperty(oBindingContext.getPath() + "/stuckAuslosungEnabled", false);
                            oModel.setProperty(oBindingContext.getPath() + "/wahrungEnabled", false);

                            // Show message box that PartNumber does not exist
                            sap.m.MessageBox.error("The given PartNumber does not exist!", {
                                title: "PartNumber Not Found",
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function () {
                                    // Actions to perform after closing the message box, if any
                                }
                            });
                        }
                    }
                });
            },
            // Kievfag handle change (for comboBox)
            onChangeKIEVFAG: function (oEvent) {
                var sSelectedValue = oEvent.getParameter("selectedItem").getKey();
                var oModel = this.getView().getModel("applicationModel");

                // Update the model property with the selected value
                oModel.setProperty("/KIEVFAG", sSelectedValue);

                // Optionally, you can perform additional logic here based on the selected value
                // Example: Call a function to handle further processing
                this.handleKIEVFAGChange(sSelectedValue);
            },
            // Kievfag handle change function
            handleKIEVFAGChange: function (sSelectedValue) {
                // Implement your logic based on the selected value
                // Example: Perform actions based on different selected values
                switch (sSelectedValue) {
                    case "XE":
                        // Handle logic for XE
                        break;
                    case "EA":
                        // Handle logic for EA
                        break;
                    case "EE":
                        // Handle logic for EA
                        break;
                    case "EF":
                        // Handle logic for EA
                        break;
                    case "EP":
                        // Handle logic for EA
                        break;
                    case "ES":
                        // Handle logic for EA
                        break;
                    case "EV":
                        // Handle logic for EA
                        break;
                    default:
                        // Default case logic
                        break;
                }
            },
            // Currency change function(for comboBox)
            onSelectionChangeCurrency: function (oEvent) {
                var oComboBox = oEvent.getSource();
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sSelectedKey = oSelectedItem ? oSelectedItem.getKey().trim() : "";

                // List of valid currency keys (keys should match the `key` attribute in items)
                var aValidKeys = ["EUR European Euro ", "USD United States Dollar", "JPY Japanese Yen", "GBP British Pound", "AUD Australian Dollar", "CAD Canadian Dollar", "CHF Swiss Franc", "CNY Chinese Yuan", "SEK Swedish Krona", "NZD New Zealand Dollar"];

                // Perform validation
                if (sSelectedKey === "" || !aValidKeys.includes(sSelectedKey)) {
                    // Set the value state to Error and display a message
                    oComboBox.setValueState(sap.ui.core.ValueState.Error);
                    oComboBox.setValueStateText("Please select a valid currency.");
                } else {
                    // Clear any error state if a valid currency is selected
                    oComboBox.setValueState(sap.ui.core.ValueState.None);
                    oComboBox.setValueStateText("");

                    // Update the model with the selected key
                    var oModel = this.getView().getModel("applicationModel");
                    oModel.setProperty("/wahrung", sSelectedKey);
                }
            },
            onPressNextStep1_33: function () {
                var aBauphaseSet = this.getView().getModel("applicationModel").getProperty("/Derivate_Baukasten_ProjectSet");
                this.getView().getModel("applicationModel").setProperty("/Step4Values", aBauphaseSet);
                var oView = this.getView();
                var oButtontYes121 = this.getView().byId("BtnPressYes121");
                var oButtonNo121 = this.getView().byId("BtnPressNo121");
                oButtontYes121.setEnabled(false);
                oButtonNo121.setEnabled(false);
                var oTextArea133 = this.getView().byId("inputStep_1_2_2");
                oTextArea133.setEnabled(false);
            },
            onPressNextStep123: function () {
                var aBauphaseSet = this.getView().getModel("applicationModel").getProperty("/MT_BBG_VorserieSet");
                this.getView().getModel("applicationModel").setProperty("/Step5Values", aBauphaseSet);
            },
            onPressNextStep124: function () {
            },
            onWizardStepActivate1_4: function () {
                var oCurrentLoggedOnUser = this.getView().getModel("applicationModel").getProperty("/AuthorizationSet");
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step5VerwenderOption2", oCurrentLoggedOnUser);
                var oView = this.getView();
                oView.byId(this.createId("wizard")).validateStep(oView.byId(this.createId("wizard")).getProgressStep());
            },
            onActivateStep28: function () {
                var oModel = this.getView().getModel("applicationModel");

                // Disable the buttons
                oModel.setProperty("/enableSaveButtonOption3", false);
                oModel.setProperty("/enableUserCheckButtonOption3", false);
            },

            _validateKIEVFAG: function (sKIEVFAG) {
                // Check if the KIEVFAG value is not empty or just whitespace
                return sKIEVFAG && sKIEVFAG.trim() !== "";
            },
            // User Check Button Press function
            onPressUserCheckOption3: function () {
                var oModel = this.getView().getModel("applicationModel");
                var aStep28Data = oModel.getProperty("/step28Data");
                var allValid = true;

                // Iterate through each row in the table data
                aStep28Data.forEach(function (row, index) {


                    // Validate KIEVFAG
                    if (!this._validateKIEVFAG(row.KIEVFAG)) {
                        allValid = false;
                        oModel.setProperty("/step28Data/" + index + "/KIEVFAG", "");
                        return; // Exit forEach loop early if KIEVFAG is invalid
                    }

                    // Validate stuckAuslosung
                    if (!this._validateStuckAuslosung(row.stuckAuslosung)) {
                        allValid = false;
                        oModel.setProperty("/step28Data/" + index + "/stuckAuslosung", "");
                        return; // Exit forEach loop early if stuckAuslosung is invalid
                    }

                    // Validate modulOrg (new validation example)
                    if (!this._validateModulOrg(row.modulOrg)) {
                        allValid = false;
                        oModel.setProperty("/step28Data/" + index + "/modulOrg", "");
                        return; // Exit forEach loop early if modulOrg is invalid
                    }

                }, this);

                // Show message boxes based on validation result
                if (allValid) {
                    sap.m.MessageBox.success("All the Users were successfully validated.", {
                        title: "Success"
                    });
                } else {
                    sap.m.MessageBox.error("Please enter correct values for all table fields.", {
                        title: "Error"
                    });
                }
            },

            // Example validation function for 'modulOrg'
            _validateModulOrg: function (sModulOrg) {
                // Ensure the field is not empty
                return sModulOrg && sModulOrg.trim() !== "";
            },

            onCombo21Change: function (oEvent) {
                var oComboBox = oEvent.getSource();
                var sValue = oComboBox.getValue(); // Get the value of the ComboBox

                // Check if the value is empty
                if (!sValue || sValue.trim() === "") {
                    // Set the ComboBox to indicate invalid value
                    oComboBox.setValueState(sap.ui.core.ValueState.Error);
                    oComboBox.setValueStateText("Please enter a value.");
                } else {
                    // Clear any error state if the value is valid
                    oComboBox.setValueState(sap.ui.core.ValueState.None);
                    oComboBox.setValueStateText(""); // Clear the error message text
                }
            },
            onChangeComboOpt2: function (oEvent) {
                // Get the ComboBox control from the event source
                var oComboBox = oEvent.getSource();

                // Retrieve the selected key from the ComboBox
                var sSelectedKey = oComboBox.getSelectedKey();

                // Log the selected key for debugging
                console.log("Selected Key in onChangeComboOpt2:", sSelectedKey);

                // Retrieve the value from the ComboBox (optional, but not used in your logic)
                var sValue = oComboBox.getValue();

                // Get the view and model
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Update the model property with the selected key
                oModel.setProperty("/selected1_5", sSelectedKey);
            },
            onPressButtonYesStep7Opt2: function (oEvent) {
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Reset fields
                oModel.setProperty("/Sup_Cust_nr", "");
                oModel.setProperty("/Department", "");
                oModel.setProperty("/Street", "");
                oModel.setProperty("/Land", "");
                oModel.setProperty("/PLZ", "");
                oModel.setProperty("/Ort", "");

                // Clear fields related to Option B if needed
                if (oModel.getProperty("/RadioButtonSelected") !== "OptionA") {
                    oModel.setProperty("/Wizard/Step7Opt2SelectedExternalReceiver", {});
                    oModel.setProperty("/Wizard/Step7Opt2SelectedInternalUser/Sup_Cust_nr", "");
                    oModel.setProperty("/Wizard/Step7Opt2SelectedInternalUser/Department", "");
                    oModel.setProperty("/Wizard/Step7Opt2SelectedInternalUser/Street", "");
                    oModel.setProperty("/Wizard/Step7Opt2SelectedInternalUser/Country_ZIP_Place", "");
                    oModel.setProperty("/Wizard/Step7Opt2SelectedInternalUser/Contact_Person", "");
                    oModel.setProperty("/Wizard/Step7Opt2SelectedInternalUser/Phone", "");
                }

                // Update labels and UI elements
                var lblSupplier = oView.byId("SupplierLabel");
                lblSupplier.setRequired(false);
                var lblInternal = oView.byId("InternalLabel");
                lblInternal.setRequired(true);

                // Clear FilterBar inputs and Table selections
                var oFilterBar = oView.byId("fbBenutzersucheOpt2");
                oFilterBar.fireClear();
                var oTable = oView.byId("tableBenutzersucheOpt2");
                oTable.removeSelections();

                // Load or refresh data
                var that = this;
                jQuery.getJSON("./model/data.json", function (data) {
                    that._filterExternalReceivers(data.User_detailsSet);
                    that._filterLocationDetails(data.LocationDetailsSet);
                    oModel.setProperty("/User_detailsSet", data.User_detailsSet);
                    oModel.setProperty("/LocationDetailsSet", data.LocationDetailsSet);
                });

                // Show/hide panels and set panel states
                oView.byId("panelBenutzersucheOpt2").setVisible(true);
                oView.byId("panelBenutzerStandortOpt2").setVisible(true);
                oView.byId("panelBenutsersucheLieferungOpt2").setVisible(false);
                oView.byId("panelBenutzersucheOpt2").setExpanded(true);

                // Set editability of the input field in the next step
                oModel.setProperty("/isInputEditable", true); // Set to true for Yes option

                // Proceed with validation
                this.handleReceiverChangeSummary();
                oView.byId("wizard").invalidateStep(oView.byId("wizard").getProgressStep());
                oModel.setProperty("/RadioButtonSelected18", "OptionA");

                oView.byId("btnYesStep7Opt2").setPressed(true);
                oView.byId("btnNoStep7Opt2").setPressed(false);
            },
            onPressButtonNoStep7Opt2: function (oEvent) {
                var oView = this.getView();
                var oModel = oView.getModel("applicationModel");

                // Update button states
                oView.byId("btnYesStep7Opt2").setPressed(false);
                oView.byId("btnNoStep7Opt2").setPressed(true);

                // Hide/show panels and filterbars
                oView.byId("panelBenutzersucheOpt2").setVisible(false);
                oView.byId("panelBenutzerStandortOpt2").setVisible(false);
                oView.byId("panelBenutsersucheLieferungOpt2").setVisible(true);
                oView.byId("fbExternalReceiversOpt2").setVisible(true);

                // Clear selections and refresh data
                var oFilterBar = oView.byId("fbBenutzersuche");
                oFilterBar.fireClear();
                var oTable = oView.byId("tableBenutzersuche");
                oTable.removeSelections();
                var oFilterBarStandort = oView.byId("fbBenutzerStandort");
                oFilterBarStandort.fireClear();
                var oTableStandort = oView.byId("tableBenutzerStandort");
                oTableStandort.removeSelections();

                // Update model for internal user data
                if (oModel.getProperty("/RadioButtonSelected") !== "OptionB") {
                    oModel.setProperty("/Wizard/Step7SelectedInternalUser", {});
                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver/Sup_Cust_nr", "");
                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver/Department", "");
                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver/Street", "");
                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver/Country_ZIP_Place", "");
                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver/Contact_Person", "");
                    oModel.setProperty("/Wizard/Step7SelectedExternalReceiver/Phone", "");

                    oModel.setProperty("/Wizard/Step7SelectedInternalUserStandort/ConstructionSite", "");
                    oModel.setProperty("/Wizard/Step7SelectedInternalUserStandort/LocationPart", "");
                    oModel.setProperty("/Wizard/Step7SelectedInternalUserStandort/Sup_Cust_nr", "");
                }

                // Update labels
                var lblSupplier = oView.byId("SupplierLabel");
                lblSupplier.setRequired(true);
                var lblInternal = oView.byId("InternalLabel");
                lblInternal.setRequired(false);

                // Load or refresh data
                var that = this;
                jQuery.getJSON("./model/data.json", function (data) {
                    oModel.setProperty("/External_receiverSet", data.External_receiverSet);
                    that._filterBenucheLiefrung(data.External_receiverSet);
                });

                oView.byId("panelBenutsersucheLieferungOpt2").setExpanded(true);

                // Set editability of the input field in the next step
                oModel.setProperty("/isInputEditable", false); // Set to false for No option
                oModel.setProperty("/RadioButtonSelected18", "OptionB");
                // Proceed with validation
                this.handleReceiverChangeOption6Summary();
                oView.byId("wizard").invalidateStep(oView.byId("wizard").getProgressStep());
            },
            onPressNextStep2_7: function (oEvent) {
                this.getView().getModel("applicationModel").setProperty("/Wizard/pwErstellenEnabled", false);
            },
            onPressNextStep14: function (oEvent) {
                var oView = this.getView();
                var oVBox = oView.byId("Vbox1_4");

                // Get all the children of the VBox
                var aItems = oVBox.getItems();

                // Iterate over all children and set their enabled property to false
                aItems.forEach(function (oItem) {
                    if (oItem.setEnabled) {
                        oItem.setEnabled(false);
                    }
                    // For HBox, iterate over its children
                    if (oItem.getItems) {
                        oItem.getItems().forEach(function (oChildItem) {
                            if (oChildItem.setEnabled) {
                                oChildItem.setEnabled(false);
                            }
                        });
                    }
                });
            },
            /*
            *   ASA COMENTAM TOATE FUNCTIILE
            */
            onPressSelectAbgestimmtStep51: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oContext = oSelectedItem.getBindingContext("applicationModel");
                var oSelectedUser = oContext.getObject();
                this.getView().getModel("applicationModel").setProperty("/Wizard/Step51SelectedUser", oSelectedUser);
                this.getView().byId("wizard").nextStep();
            },
            onTableUpdateFinished: function (oEvent) {
                var oTable = oEvent.getSource();
                var oItems = oTable.getItems();
                var iItemCount = oItems.length;

                // Minimum and maximum height in pixels
                var iMinHeight = 100;
                var iMaxHeight = 300;

                // Calculate the new height
                var iNewHeight = iItemCount * 50; // Assuming each item takes approximately 50px height

                if (iNewHeight < iMinHeight) {
                    iNewHeight = iMinHeight;
                } else if (iNewHeight > iMaxHeight) {
                    iNewHeight = iMaxHeight;
                }

                // Get the ScrollContainer and set the new height
                var oScrollContainer1 = this.byId("scAbgestimmtStep51");
                var oScrollContainer2 = this.byId("scBenutzerStep7");
                var oScrollContainer3 = this.byId("scLocationStep7");
                var oScrollContainer4 = this.byId("scExternalReceivers");
                oScrollContainer1.setHeight(iNewHeight + "px");
                oScrollContainer2.setHeight(iNewHeight + "px");
                oScrollContainer3.setHeight(iNewHeight + "px");
                oScrollContainer4.setHeight(iNewHeight + "px");
            },
            onTableUpdateFinished4: function (oEvent) {
                var oTable = oEvent.getSource();
                var oItems = oTable.getItems();
                var iItemCount = oItems.length;

                // Minimum and maximum height in pixels
                var iMinHeight = 100;
                var iMaxHeight = 300;

                // Calculate the new height
                var iNewHeight = iItemCount * 50; // Assuming each item takes approximately 50px height

                if (iNewHeight < iMinHeight) {
                    iNewHeight = iMinHeight;
                } else if (iNewHeight > iMaxHeight) {
                    iNewHeight = iMaxHeight;
                }

                // Get the ScrollContainer and set the new height
                var oScrollContainer1 = this.byId("scExternalReceiversOpt2");
                oScrollContainer1.setHeight(iNewHeight + "px");
            },
            onPressNextStep15: function () {
                var oView = this.getView();
                var btnYesStep7Opt2 = oView.byId("btnYesStep7Opt2");
                var btnNoStep7Opt2 = oView.byId("btnNoStep7Opt2");

                // Disable buttons and set the HBox to invisible
                btnYesStep7Opt2.setEnabled(false);
                btnNoStep7Opt2.setEnabled(false);

                // Hide other panels as needed
                oView.byId("panelBenutzersucheOpt2").setVisible(false);
                oView.byId("panelBenutzerStandortOpt2").setVisible(false);
                oView.byId("panelBenutsersucheLieferungOpt2").setVisible(false);
            },
            onPressButtonYesStep17: function () {
                var oView = this.getView();
                oView.byId("panelAbgetstimmt17").setVisible(true);
                oView.byId("scAbgestimmtStep17").setVisible(true);
                oView.byId("tableAbgestimmtStep17").setVisible(true);
                oView.byId("BtnPressYes17").setPressed(true);
                oView.byId("BtnPressNo17").setPressed(false);
                this.onPressClearSearchAbgestimmtStep17();
            },
            onPressButtonNo17: function () {
                var oView = this.getView();
                oView.byId("panelAbgetstimmt17").setVisible(false);
                oView.byId("scAbgestimmtStep17").setVisible(false);
                oView.byId("tableAbgestimmtStep17").setVisible(false);
                oView.byId("BtnPressYes17").setPressed(false);
                oView.byId("BtnPressNo17").setPressed(true);
                oView.byId("wizard").validateStep(oView.byId("wizard").getProgressStep());
            },
            onPressNextStep17: function () {
                var oView = this.getView();
                var BtnPressYes17 = oView.byId("BtnPressYes17");
                var BtnPressNo17 = oView.byId("BtnPressNo17");
                oView.byId("panelAbgetstimmt17").setVisible(false);
                oView.byId("fbAbgestimmtSearch17").setVisible(false);
                oView.byId("scAbgestimmtStep17").setVisible(false);

                BtnPressYes17.setEnabled(false);
                BtnPressNo17.setEnabled(false);
            },
            onChangeInput21: function (oEvent) {
                var oModel = this.getView().getModel("applicationModel");
                var sValue = oEvent.getParameter("value"); // Get the value from the TextArea
                oModel.setProperty("/Wizard/inputStep21", sValue); // Set the value to the model
            },
            onPressButtonYesStep121: function () {
                // Show the VBox containing the Text and Input
                this.byId("hboxStep121").setVisible(true);

                // Set the "Yes" button as pressed and "No" button as unpressed
                this.byId("BtnPressYes121").setPressed(true);
                this.byId("BtnPressNo121").setPressed(false);
            },

            onPressButtonNoStep121: function () {
                // Hide the VBox containing the Text and Input

                this.byId("hboxStep121").setVisible(false);
                // Set the "No" button as pressed and "Yes" button as unpressed
                this.byId("BtnPressYes121").setPressed(false);
                this.byId("BtnPressNo121").setPressed(true);
                var oWizard = this.byId("wizard");
                oWizard.validateStep(oWizard.getProgressStep());
            },
            onLiveChangeKostenstelle121: function (oEvent) {
                var sValue = oEvent.getParameter("value");

                // Filter out non-digit characters and prevent starting with '0'
                if (sValue.charAt(0) === '0') {
                    sValue = sValue.slice(1); // Remove the first character if it's '0'
                }
                sValue = sValue.replace(/\D/g, '');

                var oModel = this.getView().getModel("applicationModel");
                var bIsValid = /^\d{4,}$/.test(sValue); // Check if input contains only digits and has at least 4 digits

                // Update the model property
                oModel.setProperty("/kostenstelle", sValue);
                oModel.setProperty("/kostenstelleValid", bIsValid);

                // Update the value state of the input field
                this.byId("inputKostenstelle121").setValue(sValue);
                this.byId("inputKostenstelle121").setValueStateText(bIsValid ? "" : "Please enter at least 4 digits, and do not start with '0'.");

                // Validate the current step
                var oWizard = this.byId("wizard");
                if (bIsValid) {
                    oWizard.validateStep(oWizard.getProgressStep());
                } else {
                    oWizard.invalidateStep(oWizard.getProgressStep());
                }
            },
            onLiveChangeInputStep122: function (oEvent) {
                var sValue = oEvent.getParameter("value").trim();
                var oModel = this.getView().getModel("applicationModel");
                var bIsValid = sValue.length > 0; // Ensure there is some input

                // Update the model property with the current value and validation state
                oModel.setProperty("/Wizard/Step1_2_2TextValue", sValue);
                oModel.setProperty("/Wizard/Step1_2_2TextValueValueState", bIsValid ? "None" : "Error");

                // Update the value state of the TextArea to provide visual feedback
                this.byId("inputStep_1_2_2").setValueState(bIsValid ? "None" : "Error");
                this.byId("inputStep_1_2_2").setValueStateText(bIsValid ? "" : "This field is required.");

                // Validate or invalidate the wizard step
                var oWizard = this.byId("wizard");
                if (bIsValid) {
                    oWizard.validateStep(oWizard.getProgressStep());
                } else {
                    oWizard.invalidateStep(oWizard.getProgressStep());
                }
            },
            onChangeComboBoxDerivateSummary18: function (oEvent) {
                var oComboBox = oEvent.getSource();
                var sValue = oComboBox.getValue();
                var aItems = oComboBox.getItems();
                var bIsValid = false;
            
                // Check if the entered value matches any item in the ComboBox
                for (var i = 0; i < aItems.length; i++) {
                    var oItem = aItems[i];
                    if (oItem.getText() === sValue) {
                        bIsValid = true;
                        break;
                    }
                }
            
                // Set the ValueState based on the validity of the entered value
                if (bIsValid) {
                    oComboBox.setValueState("None");
                    oComboBox.setValueStateText("");
                } else {
                    oComboBox.setValueState("Error");
                    oComboBox.setValueStateText("Invalid selection. Please select a valid option.");
                }
            
                // Update the selected key in the model if valid
                if (bIsValid) {
                    var sKey = oComboBox.getSelectedKey();
                    var oModel = this.getView().getModel("applicationModel");
                    oModel.setProperty("/selectedAtArt", sKey);
                } else {
                    // Optionally, clear the selected key in the model if not valid
                    oComboBox.setSelectedKey(""); // Clear selection
                }
            },
            onActivateSummary: function () {
                var oModel = this.getView().getModel("applicationModel");
                oModel.setProperty("/isNextButtonEnabled", false);
            },
        });
    });
