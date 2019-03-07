import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerTestingModule, NGXLogger, NGXLoggerMock } from 'ngx-logger';
import { of, throwError } from 'rxjs';
import { FileUploadModule } from '../../shared/components/file-upload/file-upload.module';
import { StatusModule } from '../../shared/modules/status/status.module';
import { CiDroidService } from '../../shared/services/ci-droid.service';

import { FormComponent } from './form.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatRadioChange,
  MatRadioModule,
  MatSelectChange,
  MatSelectModule,
  MatStepperModule,
  MatTooltipModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MdePopoverModule } from '@material-extended/mde';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PreviewActionComponent } from './preview-action/preview-action.component';
import { PreviewGithubInteractionComponent } from './preview-github-interaction/preview-github-interaction.component';
import Action = shared.types.Action;
import GITHUB_INTERACTION = shared.GITHUB_INTERACTION;

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let ciDroidService: CiDroidService;
  let logger: NGXLoggerMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploadModule,
        StatusModule,
        MatStepperModule,
        MatInputModule,
        NoopAnimationsModule,
        MatIconModule,
        MatSelectModule,
        MatRadioModule,
        MdePopoverModule,
        MatCardModule,
        MatTooltipModule
      ],
      declarations: [FormComponent, PreviewActionComponent, PreviewGithubInteractionComponent],
      providers: [CiDroidService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    ciDroidService = fixture.debugElement.injector.get(CiDroidService);
    logger = fixture.debugElement.injector.get(NGXLogger);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get Actions when it is initialized', () => {
    const expectedActions: Action[] = [
      {
        expectedFields: [
          {
            '@class': 'com.societegenerale.cidroid.api.actionToReplicate.fields.TextArea',
            name: 'staticContent',
            label: 'content to overwrite/create',
            fieldType: 'textArea'
          }
        ],
        actionClassToSend: 'com.societegenerale.cidroid.api.actionToReplicate.OverwriteStaticFileAction',
        label: 'overwrite/create a file with given content'
      },
      {
        expectedFields: [
          {
            '@class': 'com.societegenerale.cidroid.api.actionToReplicate.fields.TextField',
            name: 'initialValue',
            label: 'old value, to replace',
            fieldType: 'textField'
          },
          {
            '@class': 'com.societegenerale.cidroid.api.actionToReplicate.fields.TextField',
            name: 'newValue',
            label: 'new value',
            fieldType: 'textField'
          }
        ],
        actionClassToSend: 'com.societegenerale.cidroid.api.actionToReplicate.SimpleReplaceAction',
        label: 'simple replace in the file'
      }
    ];
    spyOn(ciDroidService, 'getActions').and.returnValue(of(expectedActions));
    expect(component.actions).toBeUndefined();
    component.ngOnInit();
    expect(ciDroidService.getActions).toHaveBeenCalled();
    expect(component.actions.length).toBe(2);
  });

  it('should throw error when it fails to fetch actions', () => {
    const error = new Error('Unable to handle');
    spyOn(ciDroidService, 'getActions').and.returnValue(throwError(error));
    spyOn(logger, 'error').and.callThrough();
    expect(component.actions).toBeUndefined();
    component.ngOnInit();
    expect(ciDroidService.getActions).toHaveBeenCalled();
    expect(component.actions.length).toBe(0);
    expect(logger.error).toHaveBeenCalledWith('Unable to fetch Actions', error);
  });

  it('should have a valid form', () => {
    expect(component.ciDroidForm).toBeDefined();
  });

  describe('github credential section', () => {
    it('should have gitHubOauthToken field with required validation', () => {
      const passwordCtrl = component.token;
      expect(passwordCtrl).toBeDefined();
      expect(passwordCtrl).not.toBeNull();
      const errors = passwordCtrl.errors || {};
      expect(passwordCtrl.valid).toBeFalsy();
      expect(errors['required']).toBeTruthy();
    });
  });

  describe('email for notification section', () => {
    it('should have email field with required and email validation', () => {
      const emailCtrl = component.ciDroidForm.get('email');
      expect(emailCtrl).toBeDefined();
      expect(emailCtrl).not.toBeNull();
      let errors = emailCtrl.errors || {};
      expect(emailCtrl.valid).toBeFalsy();
      expect(errors['required']).toBeTruthy();
      emailCtrl.setValue('invalid');
      errors = emailCtrl.errors || {};
      expect(errors['email']).toBeTruthy();
    });
  });

  describe('action', () => {
    let actions: Action[];

    beforeEach(() => {
      actions = [
        {
          expectedFields: [
            {
              '@class': 'com.societegenerale.cidroid.api.actionToReplicate.fields.TextArea',
              name: 'staticContent',
              label: 'content to overwrite/create',
              fieldType: 'textArea'
            }
          ],
          actionClassToSend: 'com.societegenerale.cidroid.api.actionToReplicate.OverwriteStaticFileAction',
          label: 'overwrite/create a file with given content'
        },
        {
          expectedFields: [
            {
              '@class': 'com.societegenerale.cidroid.api.actionToReplicate.fields.TextField',
              name: 'initialValue',
              label: 'old value, to replace',
              fieldType: 'textField'
            },
            {
              '@class': 'com.societegenerale.cidroid.api.actionToReplicate.fields.TextField',
              name: 'newValue',
              label: 'new value',
              fieldType: 'textField'
            }
          ],
          actionClassToSend: 'com.societegenerale.cidroid.api.actionToReplicate.SimpleReplaceAction',
          label: 'simple replace in the file'
        },
        {
          expectedFields: [
            {
              '@class': 'com.societegenerale.cidroid.api.actionToReplicate.fields.TextField',
              name: 'groupId',
              label: 'The groupId of the plugin or dependency to remove (optional)',
              fieldType: 'textField'
            }
          ],
          actionClassToSend: 'com.societegenerale.cidroid.extensions.actionToReplicate.RemoveMavenDependencyOrPluginAction',
          label: 'Remove a dependency or plugin in pom.xml, depending on provided artifactId'
        }
      ];
      component.actions = actions;
    });

    it('should have action field with required validation', () => {
      // default behavior
      const actionCtrl = component.defaultAction;
      expect(actionCtrl).toBeDefined();
      expect(actionCtrl).not.toBeNull();
      const errors = actionCtrl.errors || {};
      expect(actionCtrl.valid).toBeFalsy();
      expect(errors['required']).toBeTruthy();
    });

    it('should add validations when you chose a particular action', () => {
      let selectedAction = 'com.societegenerale.cidroid.api.actionToReplicate.SimpleReplaceAction';
      component.onActionChanged(new MatSelectChange(null, selectedAction));
      assertActionForm();
      // change the action
      selectedAction = 'com.societegenerale.cidroid.api.actionToReplicate.OverwriteStaticFileAction';
      component.onActionChanged(new MatSelectChange(null, selectedAction));
      assertActionForm();

      function assertActionForm() {
        const actionToCheck: Action = actions.find(action => action.actionClassToSend === selectedAction);
        expect(component.fields).toBe(actionToCheck.expectedFields);
        actionToCheck.expectedFields.forEach(field => {
          const formActionField = component.ciDroidForm.get(`action.${field.name}`);
          expect(formActionField).toBeDefined();
          expect(formActionField).not.toBeNull();
          const errors = formActionField.errors || {};
          expect(formActionField.valid).toBeFalsy();
          expect(errors['required']).toBeTruthy();
        });
      }
    });

    it('should add validations when you chose a particular action with optional field ', () => {
      let selectedAction = 'com.societegenerale.cidroid.api.actionToReplicate.SimpleReplaceAction';
      component.onActionChanged(new MatSelectChange(null, selectedAction));
      assertActionForm();
      // change the action
      selectedAction = 'com.societegenerale.cidroid.extensions.actionToReplicate.RemoveMavenDependencyOrPluginAction';
      component.onActionChanged(new MatSelectChange(null, selectedAction));
      assertActionForm();

      function assertActionForm() {
        const actionToCheck: Action = actions.find(action => action.actionClassToSend === selectedAction);
        expect(component.fields).toBe(actionToCheck.expectedFields);
        actionToCheck.expectedFields.forEach(field => {
          const formActionField = component.ciDroidForm.get(`action.${field.name}`);
          expect(formActionField).toBeDefined();
          expect(formActionField).not.toBeNull();
          const errors = formActionField.errors || {};
          if (field.label.includes('optional')) {
            expect(formActionField.valid).toBeTruthy();
            expect(errors['required']).toBeUndefined();
          } else {
            expect(formActionField.valid).toBeFalsy();
            expect(errors['required']).toBeTruthy();
          }
        });
      }
    });

    it('should not add validation when the user chooses a wrong action', () => {
      // chose a right action
      let selectedAction = 'com.societegenerale.cidroid.api.actionToReplicate.SimpleReplaceAction';
      component.onActionChanged(new MatSelectChange(null, selectedAction));
      // chose a wrong action
      selectedAction = 'invalid';
      component.onActionChanged(new MatSelectChange(null, selectedAction));
      const formActionField = component.defaultAction;
      expect(formActionField).toBeDefined();
      expect(formActionField).not.toBeNull();
      const errors = formActionField.errors || {};
      expect(formActionField.valid).toBeFalsy();
      expect(errors['required']).toBeTruthy();
    });
  });

  describe('github interaction section', () => {
    it('should have option field to select Push or Pull Request, default being pull request', () => {
      const githubInteractionCtrl = component.option;
      expect(githubInteractionCtrl).toBeDefined();
      expect(githubInteractionCtrl).not.toBeNull();
      expect(githubInteractionCtrl.value).toBe('.PullRequestGitHubInteraction');
      const errors = githubInteractionCtrl.errors || {};
      expect(githubInteractionCtrl.valid).toBeTruthy();
      expect(errors['required']).toBeFalsy();
    });

    // Pull requests requires title, branch name and commit message
    it('should validate the fields title, branch name and commit message as required when pull request is selected', () => {
      // pull request title
      const pullRequestTitleCtrl = component.pullRequestTitle;
      expect(pullRequestTitleCtrl).toBeDefined();
      expect(pullRequestTitleCtrl).not.toBeNull();
      let errors = pullRequestTitleCtrl.errors || {};
      expect(pullRequestTitleCtrl.valid).toBeFalsy();
      expect(errors['required']).toBeTruthy();
      // branch name
      const branchNameCtrl = component.branchName;
      expect(branchNameCtrl).toBeDefined();
      expect(branchNameCtrl).not.toBeNull();
      errors = branchNameCtrl.errors || {};
      expect(branchNameCtrl.valid).toBeFalsy();
      expect(errors['required']).toBeTruthy();
      // commit message
      const commitMessageCtrl = component.commitMessage;
      expect(commitMessageCtrl).toBeDefined();
      expect(commitMessageCtrl).not.toBeNull();
      errors = commitMessageCtrl.errors || {};
      expect(commitMessageCtrl.valid).toBeFalsy();
      expect(errors['required']).toBeTruthy();
    });

    it('should validate the field commit message as required when push is selected', () => {
      const gitHubInteractionSelected = GITHUB_INTERACTION.Push;
      component.githubInteractionChanged(new MatRadioChange(null, gitHubInteractionSelected));
      // should not have pull request title validator
      const pullRequestTitleCtrl = component.pullRequestTitle;
      let errors = pullRequestTitleCtrl.errors || {};
      expect(pullRequestTitleCtrl.valid).toBeTruthy();
      expect(pullRequestTitleCtrl.value).toBeNull();
      expect(errors['required']).toBeUndefined();
      // should not have branch name validator
      const branchNameCtrl = component.branchName;
      errors = branchNameCtrl.errors || {};
      expect(branchNameCtrl.valid).toBeTruthy();
      expect(branchNameCtrl.value).toBeNull();
      expect(errors['required']).toBeUndefined();
      // should have commit message validator
      const commitMessageCtrl = component.commitMessage;
      expect(commitMessageCtrl).toBeDefined();
      expect(commitMessageCtrl).not.toBeNull();
      errors = commitMessageCtrl.errors || {};
      expect(commitMessageCtrl.valid).toBeFalsy();
      expect(errors['required']).toBeTruthy();
    });

    it('should validate the fields title, branch name and commit message as required when selected back to pull request', () => {
      let gitHubInteractionSelected = GITHUB_INTERACTION.Push;
      component.githubInteractionChanged(new MatRadioChange(null, gitHubInteractionSelected));
      // change the interaction
      gitHubInteractionSelected = GITHUB_INTERACTION.PullRequest;
      component.githubInteractionChanged(new MatRadioChange(null, gitHubInteractionSelected));
      // should have pull request title validator
      const pullRequestTitleCtrl = component.pullRequestTitle;
      expect(pullRequestTitleCtrl).not.toBeNull();
      let errors = pullRequestTitleCtrl.errors || {};
      expect(pullRequestTitleCtrl.valid).toBeFalsy();
      expect(errors['required']).toBeTruthy();
      // should have branch name validator
      const branchNameCtrl = component.branchName;
      expect(branchNameCtrl).toBeDefined();
      expect(branchNameCtrl).not.toBeNull();
      errors = branchNameCtrl.errors || {};
      expect(branchNameCtrl.valid).toBeFalsy();
      expect(errors['required']).toBeTruthy();
      // should have commit message validator
      const commitMessageCtrl = component.commitMessage;
      expect(commitMessageCtrl).toBeDefined();
      expect(commitMessageCtrl).not.toBeNull();
      errors = commitMessageCtrl.errors || {};
      expect(commitMessageCtrl.valid).toBeFalsy();
      expect(errors['required']).toBeTruthy();
    });
  });

  describe('preview action', () => {
    let actions: Action[];

    beforeEach(() => {
      actions = [
        {
          expectedFields: [
            {
              '@class': 'com.societegenerale.cidroid.api.actionToReplicate.fields.TextArea',
              name: 'staticContent',
              label: 'content to overwrite/create',
              fieldType: 'textArea'
            }
          ],
          actionClassToSend: 'com.societegenerale.cidroid.api.actionToReplicate.OverwriteStaticFileAction',
          label: 'overwrite/create a file with given content'
        }
      ];
      component.actions = actions;
    });

    it('should get me the selected action label', () => {
      let actionLabel = component.getSelectedActionLabel('com.societegenerale.cidroid.api.actionToReplicate.OverwriteStaticFileAction');
      expect(actionLabel).toBe('overwrite/create a file with given content');
      actionLabel = component.getSelectedActionLabel('undefined');
      expect(actionLabel).toBe('');
    });

    it('should get me the selected fields', () => {
      const selectedAction = 'com.societegenerale.cidroid.api.actionToReplicate.OverwriteStaticFileAction';
      component.onActionChanged(new MatSelectChange(null, selectedAction));
      const actionFormGroup = component.ciDroidForm.get('action') as FormGroup;
      actionFormGroup.controls['staticContent'].setValue('test');

      const selectedFields = component.getSelectedFields(selectedAction);
      expect(selectedFields[0].label).toBe('content to overwrite/create');
      expect(selectedFields[0].value).toBe('test');
    });

    it('should update the resources', () => {
      expect(component.resources.length).toEqual(0);
      component.updateResources([
        {
          repoFullName: 'societe-generale/ci-droid',
          filePathOnRepo: 'Jenkinsfile',
          branchName: 'master'
        }
      ]);
      expect(component.resources.length).toEqual(1);
    });

    it('should create the request for bulk update', () => {
      const tokenCtrl = component.ciDroidForm.get('gitHubCredentials.gitHubOauthToken');
      tokenCtrl.setValue('#ABCD1234');
      const emailCtrl = component.ciDroidForm.get('email');
      emailCtrl.setValue('dileep.jami@gmail.com');
      const pullRequestTitleCtrl = component.ciDroidForm.get('githubInteraction.pullRequestTitle');
      pullRequestTitleCtrl.setValue('test title');
      const branchNameCtrl = component.ciDroidForm.get('githubInteraction.branchName');
      branchNameCtrl.setValue('feature/test');
      const commitMessageCtrl = component.ciDroidForm.get('githubInteraction.commitMessage');
      commitMessageCtrl.setValue('test commit');
      const actionCtrl = component.ciDroidForm.get('action');
      actionCtrl.setValue({ default: 'com.societegenerale.cidroid.api.actionToReplicate.OverwriteStaticFileAction' });
      expect(component.createUpdateRequest().email).toBe('dileep.jami@gmail.com');
    });

    it('should reset the form', () => {
      component.resetForm();
      expect(component.resources.length).toEqual(0);
    });

    it('show show the status component', () => {
      component.showIcons();
      expect(component.showStatus).toBeTruthy();
      setTimeout(() => {
        expect(component.showStatus).toBeFalsy();
      }, 3000);
    });
  });
});
